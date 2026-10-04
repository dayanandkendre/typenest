import { LEVELS } from './vocab-data.js';
import { VocabEngine, loadProgress, isUnlocked } from './vocab-engine.js';

const $ = id => document.getElementById(id);
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const stars = (n, cls = 'text-amber-400') => [1, 2, 3].map(i => `<i class="fa-solid fa-star ${i <= n ? cls : 'text-slate-600'}"></i>`).join('');
const DIFF = { Beginner: 'emerald', Intermediate: 'indigo', Advanced: 'rose' };
const BADGE = { emerald: 'bg-emerald-500/15 text-emerald-400', indigo: 'bg-indigo-500/15 text-indigo-300', rose: 'bg-rose-500/15 text-rose-400', amber: 'bg-amber-500/15 text-amber-400' };

/* ================= HUB ================= */
function initHub() {
  const p = loadProgress();
  $('xp-total').textContent = p.totalXP;
  $('day-streak').textContent = p.streak;
  const done = Object.keys(p.levelsCompleted).length;
  $('levels-done').textContent = `${done}/${LEVELS.length}`;
  const next = LEVELS.find(l => isUnlocked(p, l.id) && !p.levelsCompleted[l.id]) || LEVELS[0];
  $('quick-start').href = `practice.html?level=${next.id}`;
  $('quick-start-label').textContent = done ? `Continue: ${next.name}` : 'Start Beginner Level 1';

  let filter = 'Beginner';
  const grid = $('level-grid');
  const draw = () => {
    grid.innerHTML = LEVELS.filter(l => filter === 'All' || l.difficulty === filter).map(l => {
      const open = isUnlocked(p, l.id), r = p.levelsCompleted[l.id], c = DIFF[l.difficulty];
      const inner = `
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE[c]}">${l.difficulty}</span>
          ${open ? '' : '<i class="fa-solid fa-lock text-slate-500"></i>'}
        </div>
        <h3 class="text-lg font-bold">Level ${l.no}: ${l.name}</h3>
        <p class="text-sm text-slate-400 mt-1 mb-4">${l.description}</p>
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-400">${l.words.length} words</span>
          <span>${stars(r ? r.stars : 0)}</span>
        </div>
        ${r ? `<p class="text-xs text-slate-500 mt-2">Best ${r.highWpm} WPM · ${r.accuracy}% accuracy</p>` : ''}`;
      const base = 'block rounded-3xl border border-slate-800 bg-white dark:bg-slate-900/80 p-6 transition';
      return open
        ? `<a href="practice.html?level=${l.id}" class="${base} hover:border-indigo-500/60 focus-visible:ring-2 focus-visible:ring-indigo-500/50 outline-none">${inner}</a>`
        : `<div class="${base} opacity-50" aria-disabled="true">${inner}<p class="text-xs text-slate-500 mt-2">Finish Level ${l.no - 1} to unlock</p></div>`;
    }).join('') || '<p class="text-slate-400">No levels in this difficulty yet.</p>';
  };
  document.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => {
    filter = b.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(x => {
      const on = x === b;
      x.setAttribute('aria-pressed', on);
      x.classList.toggle('bg-indigo-500', on); x.classList.toggle('text-white', on);
    });
    draw();
  }));
  draw();
}

/* ================= PRACTICE ================= */
function initPractice() {
  const id = parseInt(new URLSearchParams(location.search).get('level'), 10) || 1;
  const level = LEVELS.find(l => l.id === id);
  const progress = loadProgress();
  if (!level || !isUnlocked(progress, id)) { location.replace('index.html'); return; }

  const eng = new VocabEngine();
  const typing = $('typing'), sink = $('sink'), card = $('card');
  let timer = null;

  $('level-title').textContent = `${level.difficulty} · Level ${level.no}: ${level.name}`;
  $('strict-toggle').checked = eng.strict;
  $('accent-btn').textContent = eng.accent === 'en-US' ? 'US' : 'UK';

  const render = () => {
    const hl = eng.highlight;
    typing.innerHTML = [...eng.target].map((ch, i) => {
      const s = eng.states[i], cur = i === eng.pos;
      let cls = 'text-slate-500 font-mono';
      if (s === 1) cls = 'text-emerald-400 font-medium';
      else if (s === 2) cls = 'text-rose-400 bg-rose-500/20 underline decoration-rose-500 rounded px-0.5 char-err';
      if (cur) cls = 'typing-cursor text-slate-200 font-semibold border-l-2 border-indigo-500';
      if (hl && i >= hl[0] && i < hl[1]) cls += ' target-word';
      return `<span class="${cls}">${esc(ch)}</span>`;
    }).join('');
    $('hud-wpm').textContent = eng.wpm;
    $('hud-acc').textContent = eng.accuracy + '%';
    $('hud-combo').textContent = eng.combo;
    const doneWords = eng.i + (eng.stage === 'sentence' ? 0.5 : 0);
    $('progress-bar').style.width = Math.min(100, (doneWords / eng.words.length) * 100) + '%';
  };

  eng.addEventListener('update', render);
  eng.addEventListener('stage', e => {
    const d = e.detail, w = d.word;
    $('card-word').textContent = w.word;
    $('card-phonetic').textContent = w.phonetic;
    $('card-pos').textContent = w.pos;
    $('card-en').textContent = w.en;
    $('card-mr').textContent = w.mr;
    $('hud-progress').textContent = `Word ${Math.min(d.index + 1, d.total)} of ${d.total}`;
    $('stage-label').textContent = d.stage === 'word' ? 'Stage 1 · Type the word' : 'Stage 2 · Type the sentence';
    if (d.flip) { card.classList.remove('card-flip'); void card.offsetWidth; card.classList.add('card-flip'); }
    if (d.stage === 'word') eng.speak(w.word);
  });
  eng.addEventListener('error', () => { card.classList.remove('card-shake'); void card.offsetWidth; card.classList.add('card-shake'); });
  eng.addEventListener('combo', e => {
    const { combo } = e.detail, box = $('combo-box');
    box.classList.toggle('combo-hot', combo >= 3);
    $('flame').classList.toggle('hidden', combo < 3);
    box.classList.remove('streak-pop'); void box.offsetWidth; if (combo) box.classList.add('streak-pop');
  });
  eng.addEventListener('speaking', e => $('speak-btn').classList.toggle('speaking', e.detail.on));
  eng.addEventListener('complete', e => { clearInterval(timer); showResults(e.detail); });

  const tick = () => { const s = Math.floor(eng.elapsedMs / 1000); $('hud-time').textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

  function showResults(r) {
    $('res-stars').innerHTML = [1, 2, 3].map(i => `<i class="fa-solid fa-star text-3xl ${i <= r.stars ? 'text-amber-400 star-pop' : 'text-slate-600'}" style="animation-delay:${i * 0.18}s"></i>`).join('');
    $('res-wpm').textContent = r.wpm;
    $('res-acc').textContent = r.accuracy + '%';
    $('res-xp').textContent = '+' + r.xp + (r.bonus ? ' (accuracy bonus)' : '');
    $('res-combo').textContent = r.maxCombo;
    const nextLvl = LEVELS.find(l => l.id === level.id + 1 && l.difficulty === level.difficulty);
    const nb = $('res-next');
    nb.classList.toggle('hidden', !nextLvl);
    if (nextLvl) nb.href = `practice.html?level=${nextLvl.id}`;
    const m = $('modal');
    m.classList.remove('hidden'); m.classList.add('flex');
    if (window.confetti && r.stars >= 2) {
      const fire = o => window.confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, colors: ['#10b981', '#6366f1', '#f59e0b', '#f43f5e'], ...o });
      fire({ angle: 60, origin: { x: 0, y: 0.7 } }); fire({ angle: 120, origin: { x: 1, y: 0.7 } });
    }
  }

  // input capture: a hidden sink works for desktop keyboards and mobile soft keyboards
  sink.addEventListener('input', () => { for (const ch of sink.value) eng.input(ch); sink.value = ''; });
  sink.addEventListener('keydown', e => {
    if (e.key === 'Backspace') { e.preventDefault(); eng.backspace(); }
    else if (e.key === 'Tab' || e.key === 'Enter') e.preventDefault();
  });
  const focusSink = () => sink.focus({ preventScroll: true });
  $('typing-wrap').addEventListener('click', focusSink);
  sink.addEventListener('focus', () => $('typing-wrap').classList.add('ring-2', 'ring-indigo-500/50'));
  sink.addEventListener('blur', () => $('typing-wrap').classList.remove('ring-2', 'ring-indigo-500/50'));

  $('speak-btn').addEventListener('click', () => { eng.speak(eng.current.word); focusSink(); });
  $('accent-btn').addEventListener('click', e => { e.currentTarget.textContent = eng.toggleAccent() === 'en-US' ? 'US' : 'UK'; eng.speak(eng.current.word); focusSink(); });
  $('strict-toggle').addEventListener('change', e => { eng.setStrict(e.target.checked); focusSink(); });
  $('restart-btn').addEventListener('click', () => location.reload());
  $('res-retry').addEventListener('click', () => location.reload());

  if ('speechSynthesis' in window) window.speechSynthesis.getVoices();
  eng.start(level);
  timer = setInterval(tick, 500);
  focusSink();
}

if ($('level-grid')) initHub();
else if ($('arena')) initPractice();
