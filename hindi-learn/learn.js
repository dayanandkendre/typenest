import { auth, db } from "../firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const CURRENT="hindiHomeCurrentLevel";
const STARS="hindiHomeLevel";
const SCORE="hindiHomeLevel";
const BADGE="hindiHomeLevel";

async function getUnlocked(){
  const uid=localStorage.getItem("userUID");
  if(!uid) return parseInt(localStorage.getItem(CURRENT)||"1",10);
  try{
    const snap=await getDoc(doc(db,"users",uid));
    return snap.exists() ? (snap.data().progress?.hindiHome || 1) : 1;
  }catch(e){ return parseInt(localStorage.getItem(CURRENT)||"1",10); }
}

(async function(){
  const unlocked=await getUnlocked();
  for(let i=1;i<=20;i++){
    const card=document.getElementById("level"+i);
    if(!card) continue;
    const stars=localStorage.getItem(STARS+i+"Stars");
    const score=localStorage.getItem(SCORE+i+"Score");
    const badge=localStorage.getItem(BADGE+i+"Badge");
    if(stars) document.getElementById("stars"+i)?.replaceChildren(document.createTextNode(stars));
    if(score) document.getElementById("score"+i)?.replaceChildren(document.createTextNode(score));
    if(badge) document.getElementById("badge"+i)?.replaceChildren(document.createTextNode(badge));
    if(i<=unlocked){
      card.classList.remove("locked");
      card.onclick=()=>window.location.href="level.html?id="+i;
    }
  }
  const completed=Math.max(0,Math.min(20,unlocked-1));
  document.getElementById("progressCount")?.replaceChildren(document.createTextNode(`${completed} / 20`));
  const fill=document.getElementById("progressFill"); if(fill) fill.style.width=(completed/20*100)+"%";
  document.getElementById("bestStreak")?.replaceChildren(document.createTextNode(completed+" Levels"));
})();

function openLoginModal(){
  const modal=document.getElementById("loginModal");
  if(!modal) return;
  modal.style.display="flex"; modal.style.visibility="visible"; modal.style.opacity="1";
}

function closeLoginModal(){
  const modal=document.getElementById("loginModal");
  if(!modal) return;
  modal.style.display="none"; modal.style.visibility="hidden"; modal.style.opacity="0";
}

// Inline handlers in the existing page architecture require a global function.
function openLevel(level){
  const userUID=localStorage.getItem("userUID");
  if(!userUID){
    localStorage.setItem("hindiSelectedLevel", String(level));
    openLoginModal();
    return;
  }
  window.location.href="level.html?id="+level;
}

window.openLevel=openLevel;
window.openLoginModal=openLoginModal;
window.closeLoginModal=closeLoginModal;
