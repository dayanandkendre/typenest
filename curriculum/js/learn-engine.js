/* TypeNest Learn Engine: progress, scoring, audio, matrix + arena controllers */
(function(){
const C=window.TN_CURRICULUM,KEY='tn_learn_progress',$=s=>document.querySelector(s);
try{document.documentElement.dataset.theme=localStorage.getItem('tn_theme')||'dark'}catch(e){}
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{levels:{}}}catch(e){return{levels:{}}}};
const save=p=>{try{localStorage.setItem(KEY,JSON.stringify(p))}catch(e){}};
const unlocked=(p,n)=>n===1||!!p.levels[n-1];
const stars=(acc,wpm,L)=>{   if(acc < L.minAcc || wpm < L.minWpm) return 0;   if(acc >= 98 && wpm >= L.targetWpm) return 5;   if(acc >= 95) return 4;   if(acc >= 90) return 3;   if(acc >= 85) return 2;   return 1; // 80% te 84.9% accuracy asel tari 1 star milun level clear hoil };
/* ---- polyphonic procedural audio ---- */
let ac;const A=()=>ac||(ac=new(window.AudioContext||window.webkitAudioContext)());
function tone(f,d,type,v,t){try{const a=A(),o=a.createOscillator(),g=a.createGain(),s=a.currentTime+(t||0);o.type=type||'sine';o.frequency.value=f;g.gain.setValueAtTime(v||.06,s);g.gain.exponentialRampToValueAtTime(.0001,s+d);o.connect(g);g.connect(a.destination);o.start(s);o.stop(s+d)}catch(e){}}
const sfx={key:()=>tone(820+Math.random()*120,.05,'triangle',.035),err:()=>tone(110,.18,'sawtooth',.06),
 win:n=>[523,659,784,1047,1319].slice(0,2+Math.min(n,3)).forEach((f,i)=>{tone(f,.55,'triangle',.07,i*.12);tone(f/2,.55,'sine',.05,i*.12)}),
 fail:()=>[330,262].forEach((f,i)=>tone(f,.4,'square',.05,i*.2))};
/* ---- matrix page ---- */
function index(){
 const p=load(),grid=$('#grid');let ch=0;
 const cleared=Object.keys(p.levels).length;
 let cur=1;while(p.levels[cur])cur++;cur=Math.min(cur,100);
 ch=Math.ceil(cur/20);
 const draw=()=>{
  $('#tabs').innerHTML=C.chapters.map((n,i)=>`<button class="tab ${ch===i+1?'on':''}" data-c="${i+1}">Ch ${i+1}<span>${n}</span></button>`).join('')+`<button class="tab ${ch===0?'on':''}" data-c="0">All<span>100 Levels</span></button>`;
  grid.innerHTML=C.levels.filter(L=>!ch||L.chapter===ch).map(L=>{
   const un=unlocked(p,L.id),rec=p.levels[L.id],[ic,bc]=C.types[L.type],st=rec?rec.stars:0;
   const cls=rec?'cleared':un?(L.id===cur?'current':'open'):'locked';
   const badge=L.id===100?'fa-rocket':ic;
   const inner=`<div class="num">${L.id}</div><div class="lk"><i class="fa-solid ${un?'fa-lock-open':'fa-lock'}"></i></div><div class="badge ${bc}"><i class="fa-solid ${badge}"></i></div><div class="sub"><b>${L.type}</b>${L.subtitle}</div><div class="stars">${[1,2,3,4,5].map(i=>`<span class="${i<=st?'lit':''}">★</span>`).join('')}</div>`;
   return un?`<a class="card ${cls}" href="arena.html?level=${L.id}" title="${L.title}">${inner}</a>`:`<div class="card locked" title="Locked">${inner}</div>`}).join('');
  $('#tabs').querySelectorAll('.tab').forEach(b=>b.onclick=()=>{ch=+b.dataset.c;draw()});
 };
 draw();$('#pct').textContent=cleared+'%';$('#bar').style.width=cleared+'%';$('#cnt').textContent=cleared+' / 100 cleared';
 const r=$('#reset');if(r)r.onclick=()=>{if(confirm('Reset all progress?')){try{localStorage.removeItem(KEY)}catch(e){}location.reload()}};
}
/* ---- arena ---- */
const ROWS=[["`1234567890-=","~!@#$%^&*()_+",[0,0,1,2,3,3,6,6,7,8,9,9,9]],["qwertyuiop[]\\","QWERTYUIOP{}|",[0,1,2,3,3,6,6,7,8,9,9,9,9]],["asdfghjkl;'","ASDFGHJKL:\"",[0,1,2,3,3,6,6,7,8,9,9]],["zxcvbnm,./","ZXCVBNM<>?",[0,1,2,3,3,6,6,7,8,9]]];
const FC=['#f472b6','#fb923c','#fbbf24','#34d399','#22d3ee','#22d3ee','#34d399','#fbbf24','#fb923c','#f472b6'];
function arena(){
 const n=Math.min(100,Math.max(1,+new URLSearchParams(location.search).get('level')||1)),L=C.levels[n-1],p=load();
 if(!unlocked(p,n)){location.replace('index.html');return}
 $('#crumb').innerHTML=`<a href="index.html">Curriculum</a> <i class="fa-solid fa-chevron-right"></i> ${C.chapters[L.chapter-1]} <i class="fa-solid fa-chevron-right"></i> Level ${n}`;
 $('#ttl').textContent=`${n}. ${L.title}`;$('#typ').textContent=L.type+(L.exam?' · Backspace penalty ON':'');
 $('#st-target').textContent=L.minWpm+' WPM / '+L.minAcc+'%';
 /* keyboard */
 const M={},kb=$('#kb');let h='';
 ROWS.forEach((row,ri)=>{h+='<div class="kr">';if(ri===3)h+='<div class="key w2" id="sL">Shift</div>';
  [...row[0]].forEach((b,i)=>{const s=row[1][i],id='k'+ri+i,f=row[2][i];M[b]={id,f,s:0};M[s]={id,f,s:1};
   h+=`<div class="key" id="${id}" style="--fc:${FC[f]}">${/[a-z]/.test(b)?b.toUpperCase():`<small>${s}</small>${b}`}</div>`});
  if(ri===3)h+='<div class="key w2" id="sR">Shift</div>';h+='</div>'});
 kb.innerHTML=h+'<div class="kr"><div class="key space" id="sp" style="--fc:#22d3ee">SPACE</div></div>';
 M[' ']={id:'sp',f:4,s:0};
 const hand=(L2)=>{const d=L2?[[10,60,0],[46,30,1],[82,15,2],[118,35,3]]:[[148,60,9],[112,30,8],[76,15,7],[40,35,6]];
  return `<svg viewBox="0 0 190 160" class="hand"><rect x="10" y="95" width="165" height="60" rx="26" class="palm"/>`+d.map(([x,y,f])=>`<rect id="f${f}" x="${x}" y="${y}" width="28" height="${112-y}" rx="14" class="fg" style="--fc:${FC[f]}"/>`).join('')+`<rect id="f${L2?4:5}" x="${L2?156:8}" y="100" width="26" height="46" rx="13" class="fg" style="--fc:${FC[4]}"/></svg>`};
 $('#hands').innerHTML=hand(1)+hand(0);
 const cue=ch=>{document.querySelectorAll('.key.on,.fg.on').forEach(e=>e.classList.remove('on'));
  const i=M[ch];if(!i)return;$('#'+i.id).classList.add('on');$('#f'+i.f).classList.add('on');
  if(i.s){const sf=i.f<5?9:0;$(i.f<5?'#sR':'#sL').classList.add('on');$('#f'+sf).classList.add('on')}};
 /* text */
 const tx=$('#text');tx.innerHTML=[...L.text].map(c=>`<span>${c===' '?'&nbsp;':c.replace('<','&lt;')}</span>`).join('');
 const sp=tx.children;let idx=0,total=0,errs=0,t0=0,timer=null,done=false;
 const st=[];
 const mark=()=>{if(sp[idx])sp[idx].className='cur';cue(L.text[idx]);if(sp[idx])tx.scrollTop=sp[idx].offsetTop-50};
 const live=()=>{const m=(Date.now()-t0)/60000,ok=st.filter(x=>x).length;const w=m>0?Math.round(ok/5/m):0,a=total?Math.max(0,(total-errs)/total*100):100;
  $('#st-wpm').textContent=w;$('#st-acc').textContent=a.toFixed(1)+'%';$('#st-err').textContent=errs;const s=Math.floor((Date.now()-t0)/1000);$('#st-time').textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');return[w,a]};
 const key=k=>{
  if(done)return;
  if(!t0&&(k.length===1)){t0=Date.now();timer=setInterval(live,250)}
  if(k==='Backspace'){if(idx>0){sp[idx].className='';idx--;st.pop();sp[idx].className='cur';cue(L.text[idx]);if(L.exam){errs++;total++;sfx.err()}}return}
  if(k.length!==1)return;
  const ok=k===L.text[idx];total++;st.push(ok);sp[idx].className=ok?'ok':'bad';ok?sfx.key():(errs++,sfx.err());idx++;
  if(idx>=L.text.length)return finish();mark();
 };
 function finish(){
  done=true;clearInterval(timer);const[w,a]=live(),s=stars(a,w,L),pass=s>0;
  if(pass){const old=p.levels[n];if(!old||s>old.stars||(s===old.stars&&w>old.wpm))p.levels[n]={stars:s,wpm:w,acc:+a.toFixed(1)};else p.levels[n]=old;save(p);sfx.win(s)}else sfx.fail();
  $('#m-title').textContent=pass?(s===5?'Flawless Victory!':'Level Cleared!'):'Not quite yet';
  $('#m-stars').innerHTML=[1,2,3,4,5].map(i=>`<span class="${i<=s?'lit':''}">★</span>`).join('');
  $('#m-wpm').textContent=w;$('#m-acc').textContent=a.toFixed(1)+'%';
  $('#m-msg').textContent=pass?(n===100?'Grandmaster! Your certificate is unlocked.':'Level '+(n+1)+' is now unlocked.'):`Need ≥${L.minAcc}% accuracy and ≥${L.minWpm} WPM to pass.`;
  const nx=$('#m-next');nx.style.display=pass?'':'none';
  if(n===100&&pass){nx.textContent='Claim Certificate';nx.onclick=()=>{try{localStorage.setItem('tn_learn_certificate',JSON.stringify({date:Date.now(),wpm:w,acc:a}))}catch(e){}window.dispatchEvent(new CustomEvent('tn:grandmaster',{detail:{wpm:w,acc:a}}));location.href='index.html'}}
  else nx.onclick=()=>{location.href=n<100?'arena.html?level='+(n+1):'index.html'};
  $('#modal').classList.add('show');
 }
 $('#m-repeat').onclick=()=>location.reload();
 $('#m-home').onclick=()=>location.href='index.html';
 const mi=$('#mi');
 document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;if(e.key==='Tab'){e.preventDefault();location.reload();return}
  if(e.key.length===1||e.key==='Backspace'){e.preventDefault();key(e.key)}});
 mi.addEventListener('input',e=>{if(e.data)[...e.data].forEach(key);mi.value=''});
 tx.parentElement.addEventListener('click',()=>mi.focus());
 mark();
}
document.addEventListener('DOMContentLoaded',()=>{if($('#grid'))index();if($('#text'))arena()});
window.TN={load,save,stars,sfx};
})();
