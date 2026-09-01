import { auth, db } from "../firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const CURRENT="hindiToprowCurrentLevel";
const STARS="hindiToprowLevel";
const SCORE="hindiToprowLevel";
const BADGE="hindiToprowBadge";
const PROGRESS_FIELD="toprow";
const LEVEL_URL="toprowlevel.html?id=";

const unlockedFromStorage=()=>parseInt(localStorage.getItem(CURRENT)||"1",10);

async function getUnlocked(){
  const uid=localStorage.getItem("userUID");
  if(!uid) return unlockedFromStorage();
  try{
    const snap=await getDoc(doc(db,"users",uid));
    return snap.exists() ? (snap.data().progress?.[PROGRESS_FIELD] || 1) : unlockedFromStorage();
  }catch(e){ return unlockedFromStorage(); }
}

(async function(){
  const unlocked=await getUnlocked();
  for(let i=1;i<=20;i++){
    const card=document.getElementById("level"+i);
    if(!card) continue;
    const stars=localStorage.getItem(STARS+i+"Stars");
    const score=localStorage.getItem(SCORE+i+"Score");
    const badge=localStorage.getItem(BADGE+i+"Badge");
    const s=document.getElementById("stars"+i); if(s&&stars) s.innerText=stars;
    const sc=document.getElementById("score"+i); if(sc&&score) sc.innerText=score;
    const b=document.getElementById("badge"+i); if(b&&badge) b.innerText=badge;

    if(i<=unlocked){
      card.classList.remove("locked");
      card.onclick=()=>{ window.location.href=LEVEL_URL+i; };
    }
  }
  const progress=document.getElementById("progressCount");
  const fill=document.getElementById("progressFill");
  const streak=document.getElementById("bestStreak");
  const completed=Math.max(0,Math.min(20,unlocked-1));
  if(progress) progress.innerText=`${completed} / 20`;
  if(fill) fill.style.width=((completed/20)*100)+"%";
  if(streak) streak.innerText=completed+" Levels";
})();
