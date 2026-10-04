import { LEVELS, TIERS } from './words-data.js';
import { AudioSynth } from './audio-synth.js';

const $ = (s) => document.querySelector(s);
const state = {
  level: null, running: false, paused: false, last: 0, elapsed: 0,
  spawnTimer: 0, entities: [], lockedId: null, inputBuffer: '',
  completed: 0, misses: 0, typed: 0, correct: 0, score: 0, combo: 0,
  maxCombo: 0, lives: 3, startTime: 0, bossSpawned: false, nextId: 1,
  best: Number(localStorage.getItem('tn_vwd_best') || 0)
};

const refs = {
  map: $('#levelMap'), game: $('#gamePanel'), tiers: $('#tierGrid'), wordLayer: $('#wordLayer'),
  arena: $('#arena'), hearts: $('#hearts'), wpm: $('#wpm'), acc: $('#accuracy'),
  combo: $('#combo'), score: $('#score'), levelTitle: $('#levelTitle'), tierLabel: $('#tierLabel'),
  objective: $('#levelObjective'), wordCount: $('#wordCount'), lockStatus: $('#lockStatus'),
  lastInput: $('#lastInput'), modal: $('#modalRoot'), crosshair: $('#crosshair'),
  message: $('#arenaMessage'), mobile: $('#mobileKeyboard'), mapBest: $('#mapBest'), mapUnlocked: $('#mapUnlocked')
};

function loadProgress() {
  const raw = JSON.parse(localStorage.getItem('tn_vwd_progress') || '{"unlocked":1,"completed":[],"best":{}}');
  return { unlocked: Number(raw.unlocked || 1), completed: raw.completed || [], best: raw.best || {} };
}
function saveProgress(p) { localStorage.setItem('tn_vwd_progress', JSON.stringify(p)); }
function renderMap() {
  const p = loadProgress();
  refs.tiers.innerHTML = TIERS.map(t => {
    const levels = LEVELS.filter(l => l.tier === t.id);
    return `<article class="tier-card">
      <div class="tier-head"><h3>${t.name}</h3><span class="section-kicker">${t.range}</span></div>
      <small>${t.subtitle}</small>
      <div class="level-list">${levels.map(l => {
        const unlocked = l.id <= p.unlocked, completed = p.completed.includes(l.id);
        const cls = `${unlocked?'unlocked':'locked'} ${completed?'completed':''} ${l.boss?'boss':''}`;
        return `<button class="level-btn ${cls}" data-level="${l.id}" ${unlocked?'':'disabled'} aria-label="Level ${l.id} ${l.title}">
          ${unlocked ? l.id : '<i class="fa-solid fa-lock"></i>'}
          ${completed ? '<span>✓ cleared</span>' : `<span>${unlocked?'play':'locked'}</span>`}
          ${p.best[l.id] ? `<em class="best">${p.best[l.id]}</em>` : ''}
        </button>`;
      }).join('')}</div>
    </article>`;
  }).join('');
  refs.mapBest.textContent = `Best: ${p.best[25] || Math.max(0, ...Object.values(p.best).map(Number), 0)}`;
  refs.mapUnlocked.textContent = `Unlocked: ${Math.min(25,p.unlocked)}/25`;
  refs.tiers.querySelectorAll('.level-btn.unlocked').forEach(b => b.addEventListener('click', () => startLevel(Number(b.dataset.level))));
}

function resetState(level) {
  Object.assign(state, { level, running:true, paused:false,last:performance.now(),elapsed:0,spawnTimer:0,entities:[],lockedId:null,inputBuffer:'',completed:0,misses:0,typed:0,correct:0,score:0,combo:0,maxCombo:0,lives:3,startTime:performance.now(),bossSpawned:false,nextId:1 });
  refs.wordLayer.innerHTML = '';
  refs.modal.innerHTML = '';
}
function renderHUD() {
  refs.levelTitle.textContent = `L${state.level.id} • ${state.level.title}`;
  refs.tierLabel.textContent = TIERS[state.level.tier-1].name;
  refs.objective.textContent = state.level.objective;
  refs.score.textContent = Math.floor(state.score).toLocaleString();
  refs.combo.textContent = `x${comboMultiplier().toFixed(1)}`;
  refs.acc.textContent = `${accuracy()}%`;
  const minutes = Math.max((performance.now()-state.startTime)/60000, .01);
  refs.wpm.textContent = Math.round((state.correct/5)/minutes);
  refs.wordCount.textContent = `${state.completed} / ${state.level.targetWords}`;
  refs.hearts.innerHTML = [0,1,2].map(i => `<i class="fa-solid fa-heart ${i<state.lives?'':'off'}"></i>`).join('');
}
function accuracy() { return state.typed ? Math.round((state.correct/state.typed)*100) : 100; }
function comboMultiplier() {
  if (state.combo >= 12) return 2;
  if (state.combo >= 6) return 1.5;
  if (state.combo >= 3) return 1.2;
  return 1;
}
function randomWord() {
  const arr = state.level.words;
  return arr[Math.floor(Math.random()*arr.length)];
}
function spawnWord(forceBoss=false) {
  if (!state.running || state.entities.length >= state.level.maxActive) return;
  const arenaW = refs.arena.clientWidth;
  const item = randomWord();
  const boss = forceBoss;
  const el = document.createElement('div');
  el.className = `word-entity ${boss?'boss':''}`;
  el.dataset.id = state.nextId++;
  el.innerHTML = `<div class="word">${item.word}</div><div class="meaning">${item.meaning}</div>`;
  const x = Math.max(75, Math.min(arenaW-75, 55 + Math.random()*(arenaW-110)));
  const entity = { id:Number(el.dataset.id), word:item.word, meaning:item.meaning, phonetic:item.phonetic, x, y:-35, progress:0, speed:state.level.fallSpeed*(boss?1.45:1)*(0.92+Math.random()*.18), el, boss };
  el.style.left = `${x}px`;
  el.style.top = `${entity.y}px`;
  refs.wordLayer.appendChild(el);
  state.entities.push(entity);
  if (boss) { state.bossSpawned=true; AudioSynth.boss(); }
}
function spawnLoop(dt) {
  state.spawnTimer += dt;
  if (state.completed >= state.level.targetWords) return;
  const interval = state.level.spawnInterval * 1000;
  if (state.spawnTimer >= interval) { state.spawnTimer=0; spawnWord(); }
  if (state.level.comboWave && state.completed>0 && state.completed%5===0 && state.entities.length===0) spawnWord();
}
function renderWord(e) {
  const matched = e.word.slice(0,e.progress);
  const rest = e.word.slice(e.progress);
  e.el.querySelector('.word').innerHTML = `<span class="matched">${matched}</span><span class="unmatched">${rest}</span>`;
  e.el.style.top = `${e.y}px`;
}
function lockEntity(e) {
  if (state.lockedId && state.lockedId !== e.id) return false;
  if (!state.lockedId) {
    state.lockedId=e.id; e.el.classList.add('targeted'); refs.crosshair.classList.add('active');
    refs.lockStatus.innerHTML = `<i class="fa-solid fa-crosshairs"></i> Locked: <strong>${e.word}</strong>`;
    AudioSynth.lock();
  }
  return true;
}
function findTargetForChar(ch) {
  if (state.lockedId) return state.entities.find(e=>e.id===state.lockedId) || null;
  const candidates = state.entities.filter(e => e.word[0]===ch && e.y > -5).sort((a,b)=>b.y-a.y);
  return candidates[0] || null;
}
function handleKey(ch) {
  if (!state.running || state.paused) return;
  AudioSynth.init();
  if (ch === 'Backspace') {
    if (!state.lockedId) return;
    const e=state.entities.find(x=>x.id===state.lockedId); if (!e) return;
    e.progress=Math.max(0,e.progress-1); state.typed++; state.misses++; state.combo=0; AudioSynth.backspace(); renderWord(e); refs.lastInput.textContent='Backspace • combo reset'; return;
  }
  if (!/^[a-zA-Z]$/.test(ch)) return;
  const key=ch.toLowerCase(); state.typed++;
  const e=findTargetForChar(key);
  if (!e) { state.misses++; state.combo=0; AudioSynth.miss(); refs.lastInput.textContent=`Miss: ${key}`; refs.arena.classList.add('flash'); setTimeout(()=>refs.arena.classList.remove('flash'),300); renderHUD(); return; }
  lockEntity(e);
  if (e.word[e.progress] !== key) {
    state.misses++; state.combo=0; AudioSynth.miss(); refs.lastInput.textContent=`Wrong key • expected ${e.word[e.progress]}`; renderHUD(); return;
  }
  e.progress++; state.correct++; AudioSynth.match(); refs.lastInput.textContent=`Matched: ${key}`; renderWord(e);
  if (e.progress >= e.word.length) completeEntity(e);
  renderHUD();
}
function completeEntity(e) {
  e.el.classList.remove('targeted'); e.el.classList.add('completed');
  state.completed++; state.combo++; state.maxCombo=Math.max(state.maxCombo,state.combo);
  const mult=comboMultiplier(); state.score += Math.round((e.word.length*110)*mult + Math.min(state.combo,20)*12);
  AudioSynth.complete(state.combo);
  if (state.combo===3 || state.combo===6 || state.combo===12) AudioSynth.combo(state.combo);
  state.entities=state.entities.filter(x=>x.id!==e.id);
  if (state.lockedId===e.id) { state.lockedId=null; refs.crosshair.classList.remove('active'); refs.lockStatus.innerHTML='<i class="fa-solid fa-crosshairs"></i> No target locked'; }
  setTimeout(()=>e.el.remove(),350);
  if (state.level.boss && state.completed===state.level.targetWords-1 && !state.bossSpawned) spawnWord(true);
  if (state.completed >= state.level.targetWords && state.entities.length<=1 && (!state.level.boss || state.bossSpawned)) finishLevel(true);
}
function loseLife(e) {
  state.lives--; state.combo=0; AudioSynth.lifeLost(); refs.arena.classList.add('shake'); setTimeout(()=>refs.arena.classList.remove('shake'),380);
  e.el.remove(); state.entities=state.entities.filter(x=>x.id!==e.id);
  if (state.lockedId===e.id) { state.lockedId=null; refs.crosshair.classList.remove('active'); }
  if (state.lives<=0) finishLevel(false);
}
function update(dt) {
  spawnLoop(dt);
  const dangerY=refs.arena.clientHeight*0.82;
  for (const e of [...state.entities]) {
    e.y += e.speed*dt;
    renderWord(e);
    if (e.y >= dangerY) loseLife(e);
  }
  renderHUD();
}
function loop(now) {
  if (!state.running) return;
  const dt=Math.min(32,now-state.last); state.last=now;
  if (!state.paused) update(dt);
  requestAnimationFrame(loop);
}
function startLevel(id) {
  const level=LEVELS.find(x=>x.id===id); if(!level) return;
  refs.map.classList.add('hidden'); refs.game.classList.remove('hidden'); resetState(level); renderHUD();
  refs.message.style.display='none'; refs.arena.focus(); AudioSynth.init(); spawnWord(); requestAnimationFrame(loop);
}
function finishLevel(win) {
  if (!state.running) return;
  state.running=false; AudioSynth[win?'levelUp':'gameOver']();
  const p=loadProgress();
  const finalScore=Math.floor(state.score);
  p.best[state.level.id]=Math.max(Number(p.best[state.level.id]||0),finalScore);
  if (win) {
    if (!p.completed.includes(state.level.id)) p.completed.push(state.level.id);
    if (state.level.id===p.unlocked && p.unlocked<25) p.unlocked++;
  }
  saveProgress(p);
  const acc=accuracy(), minutes=Math.max((performance.now()-state.startTime)/60000,.01), wpm=Math.round((state.correct/5)/minutes);
  refs.modal.innerHTML=`<div class="modal-backdrop"><div class="modal">
    <div class="modal-icon"><i class="fa-solid ${win?'fa-trophy':'fa-heart-crack'}"></i></div>
    <h2>${win?'Level Cleared!':'Defense Failed'}</h2>
    <p>${win?`You defended the line and cleared <strong>${state.level.title}</strong>.`:`The danger line was breached. Refine your accuracy and try again.`}</p>
    <div class="result-grid">
      <div><b>${finalScore.toLocaleString()}</b><small>Score</small></div>
      <div><b>${wpm}</b><small>WPM</small></div>
      <div><b>${acc}%</b><small>Accuracy</small></div>
    </div>
    <div class="modal-actions">
      <button class="secondary-btn" id="modalMap">Level Map</button>
      <button class="primary-btn" id="modalNext">${win && state.level.id<25?'Next Level':'Play Again'}</button>
    </div>
  </div></div>`;
  $('#modalMap').onclick=()=>{refs.modal.innerHTML='';refs.game.classList.add('hidden');refs.map.classList.remove('hidden');renderMap()};
  $('#modalNext').onclick=()=>{refs.modal.innerHTML='';startLevel(win&&state.level.id<25?state.level.id+1:state.level.id)};
}
function buildMobileKeyboard() {
  const rows=['qwertyuiop','asdfghjkl','zxcvbnm'];
  refs.mobile.innerHTML=rows.map(row=>[...row].map(k=>`<button type="button" data-key="${k}">${k.toUpperCase()}</button>`).join('')).join('');
  refs.mobile.addEventListener('click',e=>{const b=e.target.closest('button');if(b)handleKey(b.dataset.key)});
}
document.addEventListener('keydown', e => {
  if (e.key==='Tab' || e.key==='Alt' || e.ctrlKey || e.metaKey) return;
  if (e.key==='Backspace') e.preventDefault();
  handleKey(e.key);
});
$('#backToMap').addEventListener('click',()=>{state.running=false;refs.modal.innerHTML='';refs.game.classList.add('hidden');refs.map.classList.remove('hidden');renderMap()});
$('#themeToggle').addEventListener('click',()=>{
  const next=(document.documentElement.dataset.theme||'dark')==='dark'?'light':'dark';
  document.documentElement.dataset.theme=next;document.documentElement.classList.toggle('dark',next);localStorage.setItem('tn_theme',next);
});
buildMobileKeyboard(); renderMap();
