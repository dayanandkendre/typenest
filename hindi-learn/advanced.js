import { auth, db } from "../firebase-config.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {
  normalizeHindi, graphemes, codePoints, renderHindiText,
  getExpectedKey, setExpectedHighlight, setPressed, typedStats, KEY_IDS
} from "./hindi-inscript.js";

const lessons = {
1:{title:"सोपे वाक्य १",subtitle:"साध्या हिंदी वाक्यांचा सराव।",target:"आज मौसम अच्छा है और हवा ठंडी है।"},
2:{title:"दैनंदिन दिनचर्या",subtitle:"दैनंदिन कृतींचे वाक्य टाइप करा।",target:"मैं सुबह जल्दी उठता हूँ और नियमित अभ्यास करता हूँ।"},
3:{title:"शिक्षण",subtitle:"शिक्षणाशी संबंधित वाक्यांचा सराव।",target:"विद्यार्थी रोज नए शब्द सीखते हैं और ध्यान से लिखते हैं।"},
4:{title:"कुटुंब",subtitle:"कुटुंबावरील परिच्छेद टाइप करा।",target:"मेरा परिवार शाम को साथ बैठकर भोजन करता है और दिन की बातें करता है।"},
5:{title:"प्रवास",subtitle:"प्रवासाचे वाक्य टाइप करा।",target:"पिछले सप्ताह हमने ट्रेन से एक सुंदर शहर की यात्रा की।"},
6:{title:"आरोग्य",subtitle:"आरोग्य आणि सवयींवरील वाक्य।",target:"स्वस्थ रहने के लिए संतुलित भोजन, पर्याप्त नींद और नियमित व्यायाम जरूरी है।"},
7:{title:"काम",subtitle:"कामाच्या संदर्भातील वाक्यांचा सराव।",target:"मैं अपने कार्य पूरे समय पर करता हूँ और प्रत्येक विवरण की जाँच करता हूँ।"},
8:{title:"विरामचिन्हे",subtitle:"स्वल्पविराम आणि पूर्णविरामासह मजकूर।",target:"अच्छा अभ्यास, धैर्य और नियमितता सफलता की मजबूत नींव बनाते हैं।"},
9:{title:"प्रश्नवाचक अभ्यास",subtitle:"प्रश्नवाचक भाव को दंड और अल्पविराम के साथ टाइप करें।",target:"क्या तुमने आज अभ्यास किया। क्या तुम अपनी गति सुधारना चाहते हो।"},
10:{title:"उद्गार शैली",subtitle:"उद्गार वाले छोटे वाक्यों का शुद्ध अभ्यास।",target:"वाह, आज की टाइपिंग बहुत अच्छी रही। लगातार अभ्यास करते रहो।"},
11:{title:"संख्या आणि टक्केवारी",subtitle:"अंकांसह प्रगत मजकूर।",target:"आज मैंने २० अभ्यास पूरे किए और मेरी सटीकता ९५ प्रतिशत रही।"},
12:{title:"ई-मेल शैली",subtitle:"औपचारिक संदेश जैसी हिंदी पंक्तियाँ टाइप करें।",target:"कृपया अपना उत्तर आज शाम तक भेजें। धन्यवाद।"},
13:{title:"औपचारिक शैली",subtitle:"औपचारिक हिंदी लेखनाचा सराव।",target:"कृपया आवश्यक जानकारी ध्यानपूर्वक पढ़ें और सही स्थान पर दर्ज करें।"},
14:{title:"संयुक्ताक्षर प्रगत",subtitle:"कठीण संयुक्ताक्षरांसह वाक्य।",target:"स्वतंत्र विचार और स्पष्ट दृष्टिकोण किसी भी कार्य को बेहतर बनाते हैं।"},
15:{title:"नुक्ता प्रगत",subtitle:"नुक्ता वर्णांसह वाक्य।",target:"कृपया फ़ाइल को सुरक्षित स्थान पर रखें और ज़रूरी जानकारी जाँचें।"},
16:{title:"सांख्यिकीय परिच्छेद",subtitle:"अंक, विरामचिन्हे आणि हिंदी मजकूर।",target:"कुल १२५० इकाइयों में से ११०० इकाइयाँ समय पर भेजी गईं।"},
17:{title:"प्रशासकीय मजकूर",subtitle:"औपचारिक आणि दीर्घ वाक्य।",target:"प्रशासनिक व्यवस्था में पारदर्शिता, जिम्मेदारी और समयबद्ध कार्य महत्वपूर्ण हैं।"},
18:{title:"दीर्घ परिच्छेद",subtitle:"विविध रचनांचा मिश्रित सराव।",target:"नियमित टाइपिंग अभ्यास से उंगलियों की गति, शब्दों की पहचान और लिखने का आत्मविश्वास लगातार बेहतर होता है।"},
19:{title:"उन्नत अंतिम आव्हान",subtitle:"दीर्घ, मिश्रित आणि अचूकतेवर आधारित मजकूर।",target:"जब अभ्यास सही पद्धति से किया जाता है, तब गति के साथ सटीकता भी बढ़ती है और कठिन हिंदी शब्दों को टाइप करना आसान हो जाता है।"},
20:{title:"अंतिम परीक्षा",subtitle:"संपूर्ण हिंदी इनस्क्रिप्ट टाइपिंग अंतिम परीक्षा।",target:"हिंदी इनस्क्रिप्ट में निपुणता पाने के लिए सही कुंजी स्थान, स्पष्ट देवनागरी क्रम, नियमित अभ्यास और बिना अनुमान के सटीक टाइपिंग आवश्यक है।"},
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

const STORAGE = "{ current:"hindiAdvancedLevel", stars:"hindiAdvancedLevel", score:"hindiAdvancedLevel", badge:"hindiAdvancedBadge" }";
const PROGRESS_FIELD = "advanced";
const BACK_URL = "advanced.html";
const LEVEL_URL = "advancedlevel.html?id=";

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
