/* TypeNest Hindi Learn — Standard Hindi InScript engine.
 * The OS/input method must be set to Hindi Devanagari - INSCRIPT.
 * No transliteration is performed by this module.
 */
export const INSCRIPT = {
  "अ":{code:"KeyD",shift:true},"आ":{code:"KeyE",shift:true},"इ":{code:"KeyF",shift:true},
  "ई":{code:"KeyR",shift:true},"उ":{code:"KeyG",shift:true},"ऊ":{code:"KeyT",shift:true},
  "ए":{code:"KeyS",shift:true},"ऐ":{code:"KeyW",shift:true},"ओ":{code:"KeyA",shift:true},
  "औ":{code:"KeyQ",shift:true},"ऋ":{code:"Equal",shift:true},"ॠ":{code:"Equal",shift:true,altGr:true},
  "ा":{code:"KeyE"},"ि":{code:"KeyF"},"ी":{code:"KeyR"},"ु":{code:"KeyG"},"ू":{code:"KeyT"},
  "े":{code:"KeyS"},"ै":{code:"KeyW"},"ो":{code:"KeyA"},"ौ":{code:"KeyQ"},
  "्":{code:"KeyD"},"ं":{code:"KeyX"},"ः":{code:"Minus",shift:true},"ँ":{code:"KeyX",shift:true},
  "़":{code:"BracketRight"},"क":{code:"KeyK"},"ख":{code:"KeyK",shift:true},"क़":{code:"KeyK",altGr:true},"क़":{code:"KeyK",altGr:true},"ख़":{code:"KeyK",shift:true,altGr:true},"ख़":{code:"KeyK",shift:true,altGr:true},
  "ग":{code:"KeyI"},"घ":{code:"KeyI",shift:true},"ग़":{code:"KeyI",altGr:true},"ग़":{code:"KeyI",altGr:true},"ङ":{code:"KeyU",shift:true},
  "च":{code:"Semicolon"},"छ":{code:"Semicolon",shift:true},"ज":{code:"KeyP"},"झ":{code:"KeyP",shift:true},"ज़":{code:"KeyP",altGr:true},"ज़":{code:"KeyP",altGr:true},
  "ञ":{code:"BracketRight",shift:true},"ड़":{code:"BracketLeft",altGr:true},"ड़":{code:"BracketLeft",altGr:true},"ढ़":{code:"BracketLeft",shift:true,altGr:true},"ढ़":{code:"BracketLeft",shift:true,altGr:true},"ट":{code:"Quote"},"ठ":{code:"Quote",shift:true},
  "ड":{code:"BracketLeft"},"ढ":{code:"BracketLeft",shift:true},"ण":{code:"KeyC",shift:true},
  "ण":{code:"KeyC",shift:true},"त":{code:"KeyL"},"थ":{code:"KeyL",shift:true},"द":{code:"KeyO"},"ध":{code:"KeyO",shift:true},
  "न":{code:"KeyV"},"ऩ":{code:"KeyV",shift:true},"प":{code:"KeyH"},"फ":{code:"KeyH",shift:true},
  "फ़":{code:"KeyH",altGr:true},"फ़":{code:"KeyH",altGr:true},"ब":{code:"KeyY"},"भ":{code:"KeyY",shift:true},"म":{code:"KeyC"},
  "य":{code:"Slash"},"य़":{code:"Slash",shift:true},"र":{code:"KeyJ"},"ऱ":{code:"KeyJ",shift:true},
  "ल":{code:"KeyN"},"ळ":{code:"KeyN",shift:true},"व":{code:"KeyB"},"ऴ":{code:"KeyB",shift:true},
  "श":{code:"KeyM",shift:true},"ष":{code:"Comma",shift:true},"स":{code:"KeyM"},"ह":{code:"KeyU"},
  ".":{code:"Period"}, "।":{code:"Period",shift:true}, "॥":{code:"Period",altGr:true},
  ",":{code:"Comma"}, "॰":{code:"Comma",altGr:true}, "-":{code:"Minus"},
  "ॊ":{code:"Backquote"},"ऒ":{code:"Backquote",shift:true},"ॉ":{code:"Backslash"},"ऑ":{code:"Backslash",shift:true},
  "ृ":{code:"Equal"},"ॄ":{code:"Equal",altGr:true},
  "०":{code:"Digit0",altGr:true},"१":{code:"Digit1",altGr:true},"२":{code:"Digit2",altGr:true},"३":{code:"Digit3",altGr:true},
  "४":{code:"Digit4",altGr:true},"५":{code:"Digit5",altGr:true},"६":{code:"Digit6",altGr:true},"७":{code:"Digit7",altGr:true},
  "८":{code:"Digit8",altGr:true},"९":{code:"Digit9",altGr:true},
  "ऍ":{code:"Digit1",shift:true},"ॅ":{code:"Digit2",shift:true},"्र":{code:"Digit3",shift:true},"र्":{code:"Digit4",shift:true},
  "ज्ञ":{code:"Digit5",shift:true},"त्र":{code:"Digit6",shift:true},"क्ष":{code:"Digit7",shift:true},"श्र":{code:"Digit8",shift:true},
  "(": {code:"Digit9",shift:true}, ")": {code:"Digit0",shift:true},
  "₹":{code:"Digit4",altGr:true},
  "ZWJ":{code:"Digit1",altGr:true},"ZWNJ":{code:"Digit2",altGr:true}
};

export const KEY_IDS = {
  Backquote:"keyTilde",Digit1:"key1",Digit2:"key2",Digit3:"key3",Digit4:"key4",Digit5:"key5",
  Digit6:"key6",Digit7:"key7",Digit8:"key8",Digit9:"key9",Digit0:"key0",Minus:"keyMinus",Equal:"keyEqual",
  KeyQ:"keyQ",KeyW:"keyW",KeyE:"keyE",KeyR:"keyR",KeyT:"keyT",KeyY:"keyY",KeyU:"keyU",KeyI:"keyI",KeyO:"keyO",KeyP:"keyP",
  BracketLeft:"keyLeftBrace",BracketRight:"keyRightBrace",Backslash:"keyBackslash",
  CapsLock:"keyCaps",KeyA:"keyA",KeyS:"keyS",KeyD:"keyD",KeyF:"keyF",KeyG:"keyG",KeyH:"keyH",KeyJ:"keyJ",KeyK:"keyK",KeyL:"keyL",
  Semicolon:"keySemicolon",Quote:"keyQuote",Enter:"keyEnter",
  KeyZ:"keyZ",KeyX:"keyX",KeyC:"keyC",KeyV:"keyV",KeyB:"keyB",KeyN:"keyN",KeyM:"keyM",
  Comma:"keyLess",Period:"keyGreater",Slash:"keyQuestion",
  ShiftLeft:"keyShiftLeft",ShiftRight:"keyShiftRight",ControlLeft:"keyCtrlLeft",ControlRight:"keyCtrlRight",
  AltLeft:"keyAltLeft",AltRight:"keyAltRight",MetaLeft:"keyWin",MetaRight:"keyWin",Space:"spaceKey",
  Backspace:"keyBackspace",Tab:"keyTab"
};

export function normalizeHindi(value=""){ return String(value).normalize("NFC"); }

export function graphemes(value=""){
  value=normalizeHindi(value);
  if (globalThis.Intl && Intl.Segmenter) {
    return Array.from(new Intl.Segmenter("hi",{granularity:"grapheme"}).segment(value),x=>x.segment);
  }
  return Array.from(value);
}

export function codePoints(value=""){ return Array.from(normalizeHindi(value)); }

export function renderHindiText(target,value,el){
  const t=normalizeHindi(target), v=normalizeHindi(value);
  const tcp=codePoints(t), vcp=codePoints(v);
  let offset=0, html="";
  for(const g of graphemes(t)){
    const cps=codePoints(g), start=offset, end=offset+cps.length;
    let cls="pending-char";
    if (start < vcp.length) {
      const typed=vcp.slice(start,Math.min(end,vcp.length)).join("");
      if (typed===cps.join("") && vcp.length>=end) cls="correct-char";
      else if (start < vcp.length) cls="wrong-char";
    }
    if (vcp.length>=start && vcp.length<end) cls+=" current-char";
    html += `<span class="${cls}">${escapeHtml(g)}</span>`;
    offset=end;
  }
  el.innerHTML=html;
  return {targetCP:tcp,valueCP:vcp};
}

function escapeHtml(s){ return s.replace(/[&<>"']/g,c=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c])); }

export function getExpectedKey(target,index){
  const cps=codePoints(target);
  if(index<0 || index>=cps.length) return null;
  const remaining=cps.slice(index).join("");
  const multi=["्र","ज्ञ","त्र","क्ष","श्र","र्"];
  for(const seq of multi){
    if(remaining.startsWith(seq) && INSCRIPT[seq]) return INSCRIPT[seq];
  }
  const cp=cps[index];
  if(cp===" ") return {code:"Space",shift:false,altGr:false};
  return INSCRIPT[cp] || null;
}

export function setExpectedHighlight(target,index){
  document.querySelectorAll(".key").forEach(k=>k.classList.remove("active-key","expected-key"));
  const info=getExpectedKey(target,index);
  if(!info) return;
  const id=KEY_IDS[info.code];
  const el=document.getElementById(id);
  if(el){
    el.classList.add("active-key","expected-key");
    if(info.shift) el.classList.add("requires-shift");
    else el.classList.remove("requires-shift");
  }
}

export function setPressed(code,on=true){
  const id=KEY_IDS[code];
  if(!id) return;
  const el=document.getElementById(id);
  if(el) el.classList.toggle("key-pressed",on);
}

export function typedStats(target,value){
  const t=codePoints(target), v=codePoints(value);
  let mismatches=0, correct=0;
  const n=Math.max(t.length,v.length);
  for(let i=0;i<n;i++){
    if(i<t.length && i<v.length && t[i]===v[i]) correct++;
    else mismatches++;
  }
  const typedUnits=v.length;
  const accuracy=typedUnits ? Math.max(0,Math.round((correct/typedUnits)*100)) : 100;
  const typedGraphemes=graphemes(value).length;
  return {mismatches,correct,accuracy,typedUnits,typedGraphemes,totalUnits:t.length};
}
