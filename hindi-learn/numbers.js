import { auth, db } from "../firebase-config.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {
  normalizeHindi, graphemes, codePoints, renderHindiText,
  getExpectedKey, setExpectedHighlight, setPressed, typedStats, KEY_IDS
} from "./hindi-inscript.js";

const lessons = {
1:{title:"देवनागरी अंक १–५",subtitle:"देवनागरी अंकों का प्रारंभिक अभ्यास।",target:"१२३४५ ५४३२१ १२३४५ ५४३२१"},
2:{title:"देवनागरी अंक ६–०",subtitle:"बाकी देवनागरी अंकों का अभ्यास।",target:"६७८९० ०९८७६ ६७८९० ०९८७६"},
3:{title:"सर्व अंक",subtitle:"संपूर्ण देवनागरी अंकमाला टाइप करा।",target:"०१२३४५६७८९ ९८७६५४३२१०"},
4:{title:"अंक जोड़ी",subtitle:"दोन-दोन अंकांच्या जोड्या।",target:"१२ २१ ३४ ४३ ५६ ६५ ७८ ८७ ९० ०९"},
5:{title:"अंक समूह",subtitle:"चार-अंकी क्रमांचा सराव।",target:"१२३४ ५६७८ ९०१२ २१०९"},
6:{title:"मिश्रित अंक",subtitle:"वेगवेगळ्या क्रमांनी अंक टाइप करा।",target:"१९२० २०२६ ३८४७ ७४८३"},
7:{title:"वर्ष अभ्यास",subtitle:"वर्षांसारखे क्रम टाइप करा।",target:"१९९० २००० २०२४ २०२५ २०२६"},
8:{title:"दिनांक",subtitle:"हाइफ़न के साथ देवनागरी दिनांक टाइप करें।",target:"०१-०९-२०२६ १५-०८-१९४७"},
9:{title:"संख्या व जागा",subtitle:"संख्या आणि स्पेस यांचा सराव।",target:"१० २० ३० ४० ५० ६० ७० ८० ९०"},
10:{title:"संख्या प्रवाह",subtitle:"सलग अंकांचे संयोजन।",target:"१२३४५६७८९० ०९८७६५४३२१"},
11:{title:"मोठ्या संख्या",subtitle:"मोठ्या संख्यांवर नियंत्रण।",target:"१००० २५०० ५००० १००००"},
12:{title:"क्रमांक",subtitle:"क्रमांकासह शब्दांची रचना।",target:"क्रमांक १०१ क्रमांक २०२ क्रमांक ३०३"},
13:{title:"किंमत",subtitle:"देवनागरी अंक आणि चलन चिन्हांचा सराव।",target:"₹५० ₹१०० ₹२५० ₹५००"},
14:{title:"समय समूह",subtitle:"अंकों के समूहों का अभ्यास करें।",target:"०७ ३० १० १५ १२ ४५ १८ ००"},
15:{title:"दशमलव अभ्यास",subtitle:"दशमलव और पूर्ण संख्याओं का अभ्यास करें।",target:"१.५ २.५ १०.२५ २५.५०"},
16:{title:"संख्या कोड",subtitle:"देवनागरी अंकों वाले कोड का अभ्यास।",target:"७१-९५ ०५१३६१ ७१-९५ ०५१३६१"},
17:{title:"औद्योगिक क्रम",subtitle:"मिश्रित संख्यात्मक संकेतों का अभ्यास।",target:"०५१३६१ ७१-९ २५-१०-२०२६"},
18:{title:"अंक व वाक्य",subtitle:"अंकों के साथ छोटे हिंदी वाक्यों का अभ्यास।",target:"आज २०२६ में १०० विद्यार्थी अभ्यास करते हैं।"},
19:{title:"उन्नत संख्या परीक्षा",subtitle:"बड़े क्रम, विरामचिह्न और अंकों का अभ्यास।",target:"कुल १२५० इकाइयाँ २५ दिनों में पूरी की गईं।"},
20:{title:"अंतिम संख्या परीक्षा",subtitle:"देवनागरी अंकों की समग्र परीक्षा।",target:"वर्ष २०२६ में १०० प्रतिशत सटीकता का लक्ष्य रखें।"},
};


const level = parseInt(new URLSearchParams(window.location.search).get("id") || 1, 10);
const lesson = lessons[level] || lessons[1];
const target = normalizeHindi(lesson.target);

document.getElementById("lessonTitle").innerText = lesson.title;
document.getElementById("lessonSubtitle").innerText = lesson.subtitle;
document.getElementById("levelNumber").innerText = "पाठ " + level;

const input = document.getElementById("typingInput");
const keySound = document.getElementById("keySound");
let lessonCompleted = false;
let timerStarted = false;
let startTime = null;
let composing = false;

const STORAGE = "{ current:"hindiNumbersLevel", stars:"hindiNumbersLevel", score:"hindiNumbersLevel", badge:"hindiNumbersBadge" }";
const PROGRESS_FIELD = "numbers";
const BACK_URL = "numbers.html";
const LEVEL_URL = "numberslevel.html?id=";

function render(value=""){
  const result = renderHindiText(target, value, document.getElementById("textDisplay"));
  setExpectedHighlight(target, result.valueCP.length);
  const currentChar = document.querySelector(".current-char");
  if(currentChar){
    const container=document.querySelector(".text-display");
    const textDisplay=document.getElementById("textDisplay");
    if(container && textDisplay){
      const cw=container.offsetWidth, tw=textDisplay.scrollWidth, x=currentChar.offsetLeft;
      let tx = cw/2-x;
      if(tw<=cw) tx=0;
      else {
        if(tx>0) tx=0;
        const maxScroll=cw-tw-20;
        if(tx<maxScroll) tx=maxScroll;
      }
      textDisplay.style.transform=`translateX(${tx}px)`;
    }
  }
  return result;
}

render("");

setInterval(()=>{
  if(!timerStarted || !startTime) return;
  const seconds=Math.floor((Date.now()-startTime)/1000);
  document.getElementById("time").innerText =
    String(Math.floor(seconds/60)).padStart(2,"0")+":"+String(seconds%60).padStart(2,"0");
},1000);

function updateCaps(e){
  const w=document.getElementById("capsWarning");
  if(w) w.style.display=e.getModifierState && e.getModifierState("CapsLock") ? "block" : "none";
}

window.addEventListener("load", ()=>input.focus());
document.addEventListener("click", ()=>input.focus());

input.addEventListener("compositionstart", ()=>{ composing=true; });
input.addEventListener("compositionupdate", ()=>{ /* do not score incomplete composition */ });
input.addEventListener("compositionend", ()=>{ composing=false; input.dispatchEvent(new Event("input")); });

input.addEventListener("input", async ()=>{
  if(!timerStarted){ startTime=Date.now(); timerStarted=true; }
  if(lessonCompleted || composing) return;

  const value=normalizeHindi(input.value);
  const stats=typedStats(target,value);
  render(value);

  document.getElementById("progress").innerText=`${stats.valueCP.length} / ${stats.targetCP.length}`;
  const fill=document.getElementById("progressFill");
  if(fill) fill.style.width=Math.min(100,(stats.valueCP.length/Math.max(1,stats.targetCP.length))*100)+"%";
  document.getElementById("mistakes").innerText=stats.mismatches;
  document.getElementById("accuracy").innerText=stats.accuracy+"%";

  const elapsedMinutes=(Date.now()-startTime)/60000;
  const wpm=elapsedMinutes>0 ? Math.round((stats.typedGraphemes/5)/elapsedMinutes) : 0;
  document.getElementById("wpm").innerText=String(wpm);

  if(value===target){
    await completeLevel(stats.accuracy,wpm,stats.mismatches);
  }
});

async function completeLevel(accuracy,wpm,mistakes){
  if(lessonCompleted) return;
  lessonCompleted=true;
  timerStarted=false;

  const unlocked=parseInt(localStorage.getItem(STORAGE.current) || "1",10);
  if(accuracy>=80 && level>=unlocked) localStorage.setItem(STORAGE.current,String(level+1));

  if(accuracy>=80){
    const uid=localStorage.getItem("userUID");
    if(uid){
      try{
        const ref=doc(db,"users",uid);
        const snap=await getDoc(ref);
        const old=snap.data()?.progress?.[PROGRESS_FIELD] || 1;
        await updateDoc(ref,{["progress."+PROGRESS_FIELD]:Math.max(old,level+1)});
      }catch(err){ console.warn("Hindi progress update skipped:",err); }
    }
  }

  let stars = accuracy<80 ? "⭐" : (mistakes>=3 ? "⭐" : (mistakes>=1 ? "⭐⭐" : "⭐⭐⭐"));
  document.getElementById("resultAccuracy").innerText=accuracy+"%";
  document.getElementById("resultMistakes").innerText=mistakes;
  document.getElementById("resultWpm").innerText=wpm;
  document.getElementById("resultTime").innerText=document.getElementById("time").innerText;
  document.getElementById("starRating").innerText=accuracy<80 ? "❌ असफल" : stars;

  localStorage.setItem(STORAGE.stars+level+"Stars", stars);
  localStorage.setItem(STORAGE.score+level+"Score", accuracy+"%");
  if(accuracy===100 && mistakes===0) localStorage.setItem(STORAGE.badge+level+"Badge","🏆 Perfect");

  document.getElementById("popupTitle").innerText=accuracy<80 ? "❌ पाठ असफल" : "🎉 पाठ पूर्ण";
  const next=document.getElementById("nextBtn"), retry=document.getElementById("retryBtn");
  if(accuracy<80){
    if(next) next.style.display="none";
    if(retry) retry.style.display="inline-block";
  }else{
    if(next) next.style.display = level>=20 ? "none" : "inline-block";
    if(retry) retry.style.display="none";
  }
  const popup=document.getElementById("popup");
  if(popup) popup.style.display="flex";
}

function physicalKeyDown(e){
  updateCaps(e);
  setPressed(e.code,true);
  const expected=getExpectedKey(target, codePoints(normalizeHindi(input.value)).length);
  const physicalId=KEY_IDS[e.code];
  if(expected && physicalId && e.code===expected.code && !!e.shiftKey===!!expected.shift){
    // Physical key matches the expected InScript position.
    const el=document.getElementById(physicalId);
    if(el) el.classList.add("expected-pressed");
  }
  if(keySound && !["ShiftLeft","ShiftRight","ControlLeft","ControlRight","AltLeft","AltRight","MetaLeft","MetaRight"].includes(e.code)){
    keySound.currentTime=0; keySound.play().catch(()=>{});
  }
}
function physicalKeyUp(e){
  updateCaps(e);
  setPressed(e.code,false);
  const id=KEY_IDS[e.code];
  if(id){
    const el=document.getElementById(id);
    if(el) el.classList.remove("expected-pressed");
  }
}
document.addEventListener("keydown",physicalKeyDown);
document.addEventListener("keyup",physicalKeyUp);

document.getElementById("restartBtn")?.addEventListener("click",()=>location.reload());
document.getElementById("backBtn")?.addEventListener("click",()=>{ window.location.href=BACK_URL; });
document.getElementById("nextBtn")?.addEventListener("click",()=>{
  if(level<20) window.location.href=LEVEL_URL+(level+1);
});
document.getElementById("retryBtn")?.addEventListener("click",()=>location.reload());
