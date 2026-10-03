import { SECTION_STARTS } from './vocab-data.js';
const KEY = 'tn_vocab_progress';
const today = () => new Date().toISOString().slice(0, 10);

export const defaultProgress = () => ({ currentLevel: 1, totalXP: 0, streak: 0, lastPlayed: '', levelsCompleted: {} });

export function loadProgress() {
  try { return { ...defaultProgress(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
  catch { return defaultProgress(); }
}

/** Cloud hook: persists to users/{uid}/vocab when a Firebase user id exists. */
export function syncToCloud(data) {
  const uid = localStorage.getItem('tn_uid');
  if (!uid) return;
  const detail = { uid, path: `users/${uid}/vocab`, data };
  window.dispatchEvent(new CustomEvent('tn:vocab-sync', { detail }));
  if (typeof window.tnSaveVocab === 'function') {
    try { Promise.resolve(window.tnSaveVocab(uid, data)).catch(() => {}); } catch { /* offline: local copy is kept */ }
  }
}

export function saveProgress(p) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* storage unavailable */ }
  syncToCloud(p);
}

export function isUnlocked(progress, id) { return SECTION_STARTS.includes(id) || !!progress.levelsCompleted[id - 1]; }

export class VocabEngine extends EventTarget {
  constructor() {
    super();
    this.strict = localStorage.getItem('tn_vocab_strict') === '1';
    this.accent = localStorage.getItem('tn_vocab_accent') || 'en-US';
    this.ctx = null;
    this.reset();
  }

  get muted() {
    const m = localStorage.getItem('tn_muted'), s = localStorage.getItem('tn_sound');
    return m === 'true' || m === '1' || s === 'off' || s === 'false' || s === '0';
  }

  reset() {
    Object.assign(this, { level: null, words: [], i: 0, stage: 'word', pos: 0, states: [], target: '', total: 0, correct: 0,
      combo: 0, maxCombo: 0, xp: 0, t0: 0, t1: 0, dirty: false, done: false });
  }

  emit(name, detail = {}) { this.dispatchEvent(new CustomEvent(name, { detail })); }
  get current() { return this.words[this.i]; }
  get accuracy() { return this.total ? Math.round((this.correct / this.total) * 100) : 100; }
  get elapsedMs() { return this.t0 ? (this.t1 || Date.now()) - this.t0 : 0; }
  get wpm() { const m = Math.max(this.elapsedMs, 3000) / 60000; return this.t0 ? Math.round(this.correct / 5 / m) : 0; }

  /** [start, end) of the target word inside the sentence, or null in word stage. */
  get highlight() {
    if (this.stage !== 'sentence') return null;
    const s = this.target.toLowerCase().indexOf(this.current.word.toLowerCase());
    return s < 0 ? null : [s, s + this.current.word.length];
  }

  start(level) {
    this.reset();
    this.level = level; this.words = level.words;
    this.load(false);
    this.emit('update');
  }

  load(flip) {
    this.target = this.stage === 'word' ? this.current.word : this.current.sentence;
    this.states = new Array(this.target.length).fill(0);
    this.pos = 0; this.dirty = false;
    this.emit('stage', { stage: this.stage, index: this.i, total: this.words.length, word: this.current, flip });
  }

  input(ch) {
    if (this.done || ch.length !== 1 || this.pos >= this.target.length) return;
    if (!this.t0) this.t0 = Date.now();
    const ok = ch === this.target[this.pos];
    this.total++;
    if (ok) { this.correct++; this.states[this.pos++] = 1; this.tone(true); }
    else {
      this.dirty = true; this.tone(false); this.emit('error');
      if (this.combo) { this.combo = 0; this.emit('combo', { combo: 0, broken: true }); }
      if (!this.strict) this.states[this.pos++] = 2;
    }
    this.emit('update');
    if (this.pos === this.target.length && this.states.every(s => s === 1)) this.advance();
  }

  backspace() {
    if (this.done || this.strict || this.pos === 0) return;
    this.states[--this.pos] = 0;
    this.emit('update');
  }

  advance() {
    if (this.stage === 'word') {
      this.xp += 10;
      if (!this.dirty) { this.combo++; this.maxCombo = Math.max(this.maxCombo, this.combo); this.emit('combo', { combo: this.combo, broken: false }); }
      this.stage = 'sentence';
      this.load(true);
    } else {
      this.xp += 25;
      this.i++;
      if (this.i >= this.words.length) return this.finish();
      this.stage = 'word';
      this.load(false);
    }
    this.emit('update');
  }

  finish() {
    this.done = true; this.t1 = Date.now();
    const accuracy = this.accuracy, wpm = this.wpm;
    const bonus = accuracy >= 98 ? 50 : 0;
    this.xp += bonus;
    const stars = accuracy >= 98 && wpm >= 30 ? 3 : accuracy >= 90 && wpm >= 20 ? 2 : 1;

    const p = loadProgress(), id = this.level.id, prev = p.levelsCompleted[id];
    p.totalXP += this.xp;
    p.levelsCompleted[id] = {
      stars: Math.max(stars, prev?.stars || 0),
      highWpm: Math.max(wpm, prev?.highWpm || 0),
      accuracy: Math.max(accuracy, prev?.accuracy || 0)
    };
    p.currentLevel = Math.max(p.currentLevel, id + 1);
    const t = today();
    if (p.lastPlayed !== t) {
      const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
      p.streak = p.lastPlayed === y ? p.streak + 1 : 1;
      p.lastPlayed = t;
    }
    saveProgress(p);
    this.emit('complete', { xp: this.xp, bonus, stars, wpm, accuracy, maxCombo: this.maxCombo, seconds: Math.round(this.elapsedMs / 1000), progress: p });
  }

  /* ---------- audio ---------- */
  tone(ok) {
    if (this.muted) return;
    try {
      this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const c = this.ctx, o = c.createOscillator(), g = c.createGain(), now = c.currentTime;
      const dur = ok ? 0.05 : 0.12;
      o.type = ok ? 'triangle' : 'sawtooth';
      o.frequency.value = ok ? 450 + Math.random() * 80 : 140;
      g.gain.setValueAtTime(ok ? 0.08 : 0.06, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      o.connect(g).connect(c.destination);
      o.start(now); o.stop(now + dur + 0.01);
    } catch { /* audio unsupported */ }
  }

  speak(text) {
    if (this.muted || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = this.accent; u.rate = 0.85;
    const v = synth.getVoices().find(x => x.lang.replace('_', '-') === this.accent);
    if (v) u.voice = v;
    u.onstart = () => this.emit('speaking', { on: true });
    u.onend = u.onerror = () => this.emit('speaking', { on: false });
    synth.speak(u);
  }

  toggleAccent() { this.accent = this.accent === 'en-US' ? 'en-GB' : 'en-US'; localStorage.setItem('tn_vocab_accent', this.accent); return this.accent; }
  setStrict(v) { this.strict = v; localStorage.setItem('tn_vocab_strict', v ? '1' : '0'); }
}
