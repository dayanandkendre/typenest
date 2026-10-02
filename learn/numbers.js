// learn/numbers.js - Numbers Row Progression Engine with Safe Firebase Sync
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  updateDoc 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXzw_g1r7kvYC2d6_d4RqDOoTF_svAphc",
  authDomain: "typenext-5bd90.firebaseapp.com",
  projectId: "typenext-5bd90",
  storageBucket: "typenext-5bd90.firebasestorage.app",
  messagingSenderId: "848488048236",
  appId: "1:848488048236:web:a742a647977a48ca63da49",
  measurementId: "G-B5WGZM350T"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

const lessons = {
  1:{ title:"1 and 9", subtitle:"Index fingers practice.", target:"19 91 19 91 19 91 19 91 19 91 19 91 19 91 19 91 19 91" },
  2:{ title:"2 and 0", subtitle:"Middle fingers practice.", target:"20 02 20 02 20 02 20 02 20 02 20 02 20 02 20 02 20 02" },
  3:{ title:"1 9 2 0", subtitle:"Mixed numbers.", target:"1920 2019 1920 2019 1920 2019 1920 2019 1920 2019" },
  4:{ title:"3 and 8", subtitle:"Ring fingers practice.", target:"38 83 38 83 38 83 38 83 38 83 38 83 38 83 38 83 38 83" },
  5:{ title:"4 and 7", subtitle:"Little fingers practice.", target:"47 74 47 74 47 74 47 74 47 74 47 74 47 74 47 74 47 74" },
  6:{ title:"1 2 3 4", subtitle:"Left hand numbers.", target:"1234 4321 1234 4321 1234 4321 1234 4321 1234 4321" },
  7:{ title:"9 0 8 7", subtitle:"Right hand numbers.", target:"9087 7809 9087 7809 9087 7809 9087 7809 9087 7809" },
  8:{ title:"Mixed Numbers", subtitle:"Both hands practice.", target:"1920 3847 9201 7483 1920 3847 9201 7483 1920 3847" },
  9:{ title:"Number Flow", subtitle:"Smooth typing.", target:"1234 9870 1234 9870 1234 9870 1234 9870 1234 9870" },
  10:{ title:"Number Test", subtitle:"Mixed test.", target:"19203847 92017483 19203847 92017483 19203847 92017483" },
  11:{ title:"A1 B2", subtitle:"Letters and numbers.", target:"A1 B2 A1 B2 A1 B2 A1 B2 A1 B2 A1 B2 A1 B2 A1 B2 A1 B2" },
  12:{ title:"C3 D4", subtitle:"Letters and numbers.", target:"C3 D4 C3 D4 C3 D4 C3 D4 C3 D4 C3 D4 C3 D4 C3 D4 C3 D4" },
  13:{ title:"E5 F6", subtitle:"Letters and numbers.", target:"E5 F6 E5 F6 E5 F6 E5 F6 E5 F6 E5 F6 E5 F6 E5 F6 E5 F6" },
  14:{ title:"P71", subtitle:"Drawing number.", target:"P71 P71 P71 P71 P71 P71 P71 P71 P71 P71 P71 P71 P71 P71" },
  15:{ title:"MS9", subtitle:"Industrial code.", target:"MS9 MS9 MS9 MS9 MS9 MS9 MS9 MS9 MS9 MS9 MS9 MS9 MS9 MS9" },
  16:{ title:"P71-9MS", subtitle:"Drawing code.", target:"P71-9MS P71-9MS P71-9MS P71-9MS P71-9MS P71-9MS P71-9MS" },
  17:{ title:"051361", subtitle:"Material number.", target:"051361 051361 051361 051361 051361 051361 051361 051361" },
  18:{ title:"P71-9MS-051361", subtitle:"Industrial typing.", target:"P71-9MS-051361 P71-9MS-051361 P71-9MS-051361 P71-9MS" },
  19:{ title:"Production Code", subtitle:"Advanced code typing.", target:"P71 051361 MS9 P71 P71 051361 MS9 P71 P71 051361 MS9" },
  20:{ title:"Final Test", subtitle:"Complete challenge.", target:"P71-9MS-051361 P71 MS9 051361 P71-9MS-051361 P71 MS9" }
};

let level = parseInt(new URLSearchParams(window.location.search).get("id") || 1);
const lesson = lessons[level] || lessons[1];

document.getElementById("lessonTitle").innerText = lesson.title;
document.getElementById("lessonSubtitle").innerText = lesson.subtitle;
document.getElementById("levelNumber").innerText = "Level " + level;

let savedStars = localStorage.getItem("numbersLevel" + level + "Stars");
if (savedStars) {
  document.getElementById("topStars").innerText = savedStars;
}

function renderText(value = "") {
  let currentWord = 0;
  for (let i = 0; i < value.length; i++) {
    if (value[i] === " ") currentWord++;
  }

  let html = "";
  for (let i = 0; i < lesson.target.length; i++) {
    let cls = "pending-char";
    let tempWord = 0;
    for (let j = 0; j < i; j++) {
      if (lesson.target[j] === " ") tempWord++;
    }

    if (tempWord === currentWord) cls += " active-word";
    if (i === value.length) cls += " current-char";

    if (i < value.length) {
      cls = value[i] === lesson.target[i] ? "correct-char" : "wrong-char";
    }

    let ch = lesson.target[i] === " " ? "&nbsp;" : lesson.target[i];
    html += `<span class="${cls}">${ch}</span>`;
  }

  document.getElementById("textDisplay").innerHTML = html;

  // Key Active Highlight
  document.querySelectorAll(".key-cap").forEach(k => k.classList.remove("active-key"));
  let nextChar = lesson.target[value.length];
  if (nextChar) {
    let keyId = null;
    if (nextChar === " ") keyId = "spaceKey";
    else if (nextChar === "-") keyId = "keyMinus";
    else if (nextChar === "=") keyId = "keyEqual";
    else if (nextChar === ",") keyId = "keyLess";
    else if (nextChar === ".") keyId = "keyGreater";
    else if (nextChar === "/") keyId = "keyQuestion";
    else if (nextChar === ";") keyId = "keySemicolon";
    else if (nextChar === "'") keyId = "keyQuote";
    else if (nextChar === "[") keyId = "keyLeftBrace";
    else if (nextChar === "]") keyId = "keyRightBrace";
    else if (nextChar === "\\") keyId = "keyBackslash";
    else if (/[0-9]/.test(nextChar)) keyId = "key" + nextChar;
    else keyId = "key" + nextChar.toUpperCase();

    const activeEl = document.getElementById(keyId);
    if (activeEl) activeEl.classList.add("active-key");
  }

  // Smooth Carousel Pacing
  const currentChar = document.querySelector(".current-char");
  if (currentChar) {
    const container = document.querySelector(".text-display-box");
    const textDisplay = document.getElementById("textDisplay");
    const containerWidth = container.offsetWidth;
    const textWidth = textDisplay.scrollWidth;
    const x = currentChar.offsetLeft;
    const center = containerWidth / 2;

    let targetTranslate = center - x;
    if (textWidth <= containerWidth || targetTranslate > 0) {
      targetTranslate = 0;
    } else {
      const maxScroll = containerWidth - textWidth - 30;
      if (targetTranslate < maxScroll) targetTranslate = maxScroll;
    }
    textDisplay.style.transform = `translateX(${targetTranslate}px)`;
  }
}

renderText();

const input = document.getElementById("typingInput");
let lessonCompleted = false;
let startTime = null;
let timerStarted = false;

setInterval(function () {
  if (!timerStarted || lessonCompleted) return;
  let seconds = Math.floor((Date.now() - startTime) / 1000);
  let mins = Math.floor(seconds / 60);
  let secs = seconds % 60;
  document.getElementById("time").innerText = String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
}, 1000);

window.onload = () => input.focus();
document.addEventListener("click", () => input.focus());

input.addEventListener("input", async function () {
  if (!timerStarted) {
    startTime = Date.now();
    timerStarted = true;
  }

  if (lessonCompleted) return;

  let value = input.value;
  let mistakes = 0;

  for (let i = 0; i < value.length; i++) {
    if (value[i] !== lesson.target[i]) mistakes++;
  }

  let accuracy = 100;
  if (value.length > 0) {
    accuracy = Math.round(((value.length - mistakes) / value.length) * 100);
  }

  renderText(value);

  document.getElementById("progress").innerText = value.length + " / " + lesson.target.length;
  document.getElementById("mistakes").innerText = mistakes;
  document.getElementById("accuracy").innerText = accuracy + "%";

  let elapsedMinutes = (Date.now() - startTime) / 60000;
  if (elapsedMinutes > 0) {
    let correctCharacters = Math.max(0, value.length - mistakes);
    let wordsTyped = correctCharacters / 5;
    let wpm = Math.round(wordsTyped / elapsedMinutes);
    document.getElementById("wpm").innerText = wpm;
  }

  // Level Complete Check
  if (value.length === lesson.target.length) {
    let unlocked = parseInt(localStorage.getItem("numbersCurrentLevel") || 1);
    if (accuracy >= 80 && level >= unlocked) {
      localStorage.setItem("numbersCurrentLevel", level + 1);
    }

    let stars = "⭐⭐⭐";
    if (mistakes >= 3) stars = "⭐";
    else if (mistakes >= 1) stars = "⭐⭐";

    document.getElementById("resultAccuracy").innerText = document.getElementById("accuracy").innerText;
    document.getElementById("resultMistakes").innerText = document.getElementById("mistakes").innerText;
    document.getElementById("resultWpm").innerText = document.getElementById("wpm").innerText;
    document.getElementById("resultTime").innerText = document.getElementById("time").innerText;

    if (accuracy < 80) {
      document.getElementById("popupTitle").innerText = "❌ Level Failed";
      document.getElementById("starRating").innerText = "❌";
      document.getElementById("performanceBadge").innerText = "Practice Again (Need 80%+)";
      document.getElementById("nextBtn").classList.add("hidden");
      document.getElementById("retryBtn").classList.remove("hidden");
    } else {
      document.getElementById("popupTitle").innerText = "🎉 Level Complete";
      document.getElementById("starRating").innerText = stars;
      document.getElementById("performanceBadge").innerText = (accuracy === 100 && mistakes === 0) ? "🏆 PERFECT RUN" : "✅ Passed";
      document.getElementById("nextBtn").classList.remove("hidden");
      document.getElementById("retryBtn").classList.add("hidden");
      lessonCompleted = true;
      timerStarted = false;
    }

    localStorage.setItem("numbersLevel" + level + "Stars", stars);
    localStorage.setItem("numbersLevel" + level + "Score", accuracy + "%");

    // Firebase Sync
    const uid = localStorage.getItem("tn_uid") || (auth.currentUser && auth.currentUser.uid);
    if (uid && accuracy >= 80) {
      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const oldProgress = userSnap.data()?.progress?.numbers || 1;
          await updateDoc(userRef, {
            "progress.numbers": Math.max(oldProgress, level + 1)
          });
        }
      } catch (err) {
        console.warn("Numbers progress sync note:", err);
      }
    }

    document.getElementById("popup").classList.remove("hidden");
  }
});

// Keypress Animation
document.addEventListener("keydown", function (e) {
  if (lessonCompleted) return;
  let keyId = null;

  if (e.code === "Space") keyId = "spaceKey";
  else if (e.code === "Backspace") keyId = "keyBackspace";
  else if (e.code === "Enter") keyId = "keyEnter";
  else if (e.code === "Tab") keyId = "keyTab";
  else if (e.code === "CapsLock") keyId = "keyCaps";
  else if (e.code === "ShiftLeft") keyId = "keyShiftLeft";
  else if (e.code === "ShiftRight") keyId = "keyShiftRight";
  else if (/^[a-zA-Z0-9]$/.test(e.key)) keyId = "key" + e.key.toUpperCase();

  const keyEl = document.getElementById(keyId);
  if (keyEl) keyEl.classList.add("key-pressed");

  const capsWarning = document.getElementById("capsWarning");
  if (capsWarning) {
    if (event.getModifierState("CapsLock")) capsWarning.classList.remove("hidden");
    else capsWarning.classList.add("hidden");
  }
});

document.addEventListener("keyup", function (e) {
  if (lessonCompleted) return;
  let keyId = null;

  if (e.code === "Space") keyId = "spaceKey";
  else if (e.code === "Backspace") keyId = "keyBackspace";
  else if (e.code === "Enter") keyId = "keyEnter";
  else if (e.code === "Tab") keyId = "keyTab";
  else if (e.code === "CapsLock") keyId = "keyCaps";
  else if (e.code === "ShiftLeft") keyId = "keyShiftLeft";
  else if (e.code === "ShiftRight") keyId = "keyShiftRight";
  else if (/^[a-zA-Z0-9]$/.test(e.key)) keyId = "key" + e.key.toUpperCase();

  const keyEl = document.getElementById(keyId);
  if (keyEl) keyEl.classList.remove("key-pressed");
});

document.getElementById("restartBtn")?.addEventListener("click", () => location.reload());
document.getElementById("retryBtn")?.addEventListener("click", () => location.reload());
document.getElementById("backBtn")?.addEventListener("click", () => window.location.href = "numbers.html");
document.getElementById("nextBtn")?.addEventListener("click", () => window.location.href = "numberslevel.html?id=" + (level + 1));