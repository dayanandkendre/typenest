import { auth, db } from "../firebase-config.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {
  normalizeHindi, graphemes, codePoints, renderHindiText,
  getExpectedKey, setExpectedHighlight, setPressed, typedStats, KEY_IDS
} from "./hindi-inscript.js";

const lessons = {
1:{title:"मुख्य पंक्ति परिचय",subtitle:"क, र, प और त कुंजियों का अभ्यास करें।",target:"क र क र क र क र प त प त क र प त"},
2:{title:"मुख्य पंक्ति मिश्रण",subtitle:"होम रो की मूल कुंजियों का मिश्रित अभ्यास।",target:"क र त प क र त प त क र प क र त प"},
3:{title:"मात्रा अभ्यास १",subtitle:"क और त के साथ इ, उ और ए की मात्राएँ।",target:"कि कु के कि कु के कि कु के ति तु ते"},
4:{title:"मात्रा अभ्यास २",subtitle:"मात्राओं के क्रम और लय पर ध्यान दें।",target:"का कि की कु कू के कै को कौ का कि की"},
5:{title:"कंठ्य ध्वनियाँ",subtitle:"ख, ग और घ के संयोजन का अभ्यास।",target:"ख ग घ ख ग घ का गी घु खे खा गो"},
6:{title:"दन्त्य ध्वनियाँ",subtitle:"त, थ, द और ध के साथ अभ्यास।",target:"त थ द ध ता थी दु दे धै ति धु"},
7:{title:"पृष्ठभूमि शब्द",subtitle:"सरल शब्दों में होम रो कुंजियों का प्रयोग।",target:"कर तक तर पर कप पत तप रथ"},
8:{title:"शब्द संयोजन",subtitle:"दो और तीन अक्षर वाले शब्द लिखें।",target:"घर जल फल कल पल तन मन चल दल"},
9:{title:"मात्रा मिश्रण",subtitle:"विभिन्न मात्राओं वाले सामान्य शब्द।",target:"दिन दिल धुन फूल खेल बोल बात रात"},
10:{title:"हलंत परिचय",subtitle:"हलंत के प्रयोग से व्यंजन क्रम सीखें।",target:"क् त् प् र् स् न् म् व् क्त स्त"},
11:{title:"संयुक्त अक्षर १",subtitle:"सरल संयुक्ताक्षरों का अभ्यास।",target:"क्र ग्र प्र त्र क्त स्त स्क स्प"},
12:{title:"संयुक्त अक्षर २",subtitle:"अधिक संयुक्ताक्षरों के साथ गति बढ़ाएँ।",target:"प्र क्र ग्र त्र द्र ब्र श्र स्त न्त"},
13:{title:"अनुस्वार और विसर्ग",subtitle:"ं और ः वाले शब्दों का अभ्यास।",target:"अंग रंग गंगा हिंदी संधि दुःख"},
14:{title:"चंद्रबिंदु",subtitle:"ँ वाले शब्दों पर ध्यान दें।",target:"हाँ माँ साँस चाँद आँख गाँव"},
15:{title:"नुक्ता",subtitle:"नुक्ता वाले अक्षरों का InScript अभ्यास।",target:"ज़ फ़ ख़ ग़ क़ ड़ ढ़"},
16:{title:"मिश्रित शब्द १",subtitle:"मात्रा, हलंत और संयुक्ताक्षर का मिश्रण।",target:"प्रकाश शक्ति भक्ति स्वतंत्र"},
17:{title:"मिश्रित शब्द २",subtitle:"लंबे शब्दों की शुद्ध टाइपिंग।",target:"व्यवस्था संस्कृति प्रगति दृष्टि"},
18:{title:"लय अभ्यास",subtitle:"एक जैसी संरचनाओं को बिना गलती दोहराएँ।",target:"कर्म धर्म पर्व वर्ग तर्क वचन क्रम"},
19:{title:"उन्नत पुनरावृत्ति",subtitle:"सभी मुख्य पंक्ति संयोजनों का अभ्यास।",target:"श्रम प्रयास प्रार्थना परिवर्तन व्यवस्था"},
20:{title:"अंतिम परीक्षण",subtitle:"मुख्य पंक्ति और देवनागरी क्रम की अंतिम परीक्षा।",target:"कर्मठ विद्यार्थी नियमित अभ्यास से शुद्ध हिंदी टाइपिंग सीखता है"},
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

const STORAGE = "{ current:"hindiHomeLevel", stars:"hindiHomeLevel" + "", score:"hindiHomeLevel" + "", badge:"hindiHomeBadge" + "" }";
const PROGRESS_FIELD = "home";
const BACK_URL = "learn.html";
const LEVEL_URL = "levellevel.html?id=";

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
