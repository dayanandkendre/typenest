let ctx = null;
let master = null;

function ensureAudio() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, duration, type = 'sine', volume = 0.18, when = 0, slideTo = null) {
  const ac = ensureAudio();
  const now = ac.currentTime + when;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), now + duration);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain).connect(master);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

export const AudioSynth = {
  init() { ensureAudio(); },
  click() { tone(720, 0.035, 'square', 0.08); },
  match() { tone(1040, 0.045, 'triangle', 0.08, 0, 1280); },
  miss() { tone(150, 0.11, 'sawtooth', 0.12, 0, 85); },
  backspace() { tone(360, 0.06, 'square', 0.07, 0, 250); },
  lock() {
    tone(520, 0.07, 'triangle', 0.09, 0, 780);
    tone(1040, 0.08, 'sine', 0.06, 0.045, 1320);
  },
  complete(combo = 1) {
    const base = Math.min(1000, 540 + combo * 35);
    tone(base, 0.12, 'triangle', 0.13, 0, base * 1.4);
    tone(base * 1.5, 0.16, 'sine', 0.09, 0.08, base * 1.8);
  },
  combo(combo) {
    tone(520 + Math.min(combo, 20) * 25, 0.08, 'triangle', 0.08, 0, 880);
  },
  lifeLost() {
    tone(130, 0.32, 'sawtooth', 0.18, 0, 55);
    tone(80, 0.4, 'square', 0.11, 0.04, 42);
  },
  levelUp() {
    [0, 0.09, 0.18, 0.29].forEach((d, i) => tone(500 * Math.pow(1.18, i), 0.14, 'triangle', 0.11, d));
  },
  boss() {
    tone(90, 0.5, 'sawtooth', 0.16, 0, 38);
    tone(180, 0.35, 'square', 0.09, 0.12, 70);
  },
  gameOver() {
    tone(240, 0.22, 'sawtooth', 0.14, 0, 110);
    tone(120, 0.4, 'triangle', 0.13, 0.2, 45);
  }
};
