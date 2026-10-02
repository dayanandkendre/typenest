// learn/bottomrow.js - Bottom Row Level Progression Engine with Safe Firebase Sync
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

const level = parseInt(new URLSearchParams(window.location.search).get("id") || 1);

/* =========================================
   LESSON DATA (ALL 20 BOTTOM ROW LEVELS INTACT)
========================================= */
const lessons = {
  1:{ title:"V N Introduction", subtitle:"Learn the bottom row keys V and N.", target:["v","n","v","n"," ","v","n","v","n"," ","v","v","n","n"," ","n","n","v","v"," ","v","n","n","v"," ","n","v","v","n"," ","v","n"] },
  2:{ title:"Keys V & N", subtitle:"Practice repeated V and N keys.", target:["v","v","n","n"," ","v","v","n","n"," ","v","n","v","n"," ","n","v","v","n"," ","v","v","v","n"," ","n","n","n","v"," ","v","n"] },
  3:{ title:"VN Practice", subtitle:"Build rhythm with VN combinations.", target:["v","n","n","v"," ","v","n","n","v"," ","n","v","v","n"," ","n","v","v","n"," ","v","v","n","n"," ","n","n","v","v"," ","v","n"] },
  4:{ title:"Keys C & M", subtitle:"Learn C and M keys.", target:["c","m","c","m"," ","c","m","c","m"," ","c","c","m","m"," ","m","m","c","c"," ","c","m","m","c"," ","m","c","c","m"," ","c","m"] },
  5:{ title:"CM Practice", subtitle:"Practice C and M combinations.", target:["c","c","m","m"," ","c","c","m","m"," ","c","m","c","m"," ","m","c","m","c"," ","c","c","c","m"," ","m","m","m","c"," ","c","m"] },
  6:{ title:"VCNM Mix", subtitle:"Mix V C N M keys.", target:["v","c","n","m"," ","v","c","n","m"," ","c","m","v","n"," ","m","c","n","v"," ","v","v","c","c"," ","n","n","m","m"," ","v","n"] },
  7:{ title:"Keys X & B", subtitle:"Learn X and B keys.", target:["x","b","x","b"," ","x","b","x","b"," ","x","x","b","b"," ","b","b","x","x"," ","x","b","b","x"," ","b","x","x","b"," ","x","b"] },
  8:{ title:"XB Practice", subtitle:"Practice X and B combinations.", target:["x","x","b","b"," ","x","x","b","b"," ","x","b","x","b"," ","b","x","b","x"," ","x","x","x","b"," ","b","b","b","x"," ","x","b"] },
  9:{ title:"Bottom Mix", subtitle:"Mix X B C V keys.", target:["x","b","c","v"," ","x","b","c","v"," ","b","c","v","x"," ","v","c","b","x"," ","x","x","b","b"," ","c","c","v","v"," ","x","c"] },
  10:{ title:"Keys Z & ,", subtitle:"Learn Z and Comma keys.", target:["z",",","z",","," ","z",",","z",","," ","z","z",",",","," ",",",",","z","z"," ","z",",",",","z"," ",",","z","z",","," ","z",","] },
  11:{ title:"Z Comma Practice", subtitle:"Practice Z and Comma.", target:["z","z",",",","," ","z","z",",",","," ","z",",","z",","," ",",","z",",","z"," ","z","z","z",","," ",",",",",",","z"," ","z",","] },
  12:{ title:"Bottom Row Review", subtitle:"Review all bottom row keys.", target:["z","x","c","v"," ","b","n","m",","," ","z","x","c","v"," ","b","n","m",","," ",",","m","n","b"," ","v","c","x","z"," ","z",","] },
  13:{ title:"Left Hand Practice", subtitle:"Practice Z X C V keys.", target:["z","x","c","v"," ","z","x","c","v"," ","v","c","x","z"," ","v","c","x","z"," ","z","z","x","x"," ","c","c","v","v"," ","z","v"] },
  14:{ title:"Right Hand Practice", subtitle:"Practice B N M , keys.", target:["b","n","m",","," ","b","n","m",","," ",",","m","n","b"," ",",","m","n","b"," ","b","b","n","n"," ","m","m",",",","," ","b",","] },
  15:{ title:"Left Drill", subtitle:"Build speed with ZXCV.", target:["z","c","x","v"," ","z","v","x","c"," ","c","x","v","z"," ","v","x","c","z"," ","z","x","c","v"," ","v","c","x","z"," ","z","c"] },
  16:{ title:"Right Drill", subtitle:"Build speed with BNM,", target:["b","m","n",","," ","b",",","n","m"," ","m","n",",","b"," ",",","n","m","b"," ","b","n","m",","," ",",","m","n","b"," ","b","m"] },
  17:{ title:"Bottom Row Mix", subtitle:"Mixed bottom row practice.", target:["z","b","x","n"," ","c","m","v",","," ","b","z","n","x"," ","m","c",",","v"," ","z","x","c","v"," ","b","n","m",","," ","z","b"] },
  18:{ title:"Advanced Mix", subtitle:"Advanced bottom row combinations.", target:["v","n","c","m"," ","x","b","z",","," ",",","z","b","x"," ","m","c","n","v"," ","z","b","x","n"," ","c","m","v",","," ","v","c"] },
  19:{ title:"Bottom Row Words", subtitle:"Bottom row word practice.", target:["z","o","n","e"," ","m","o","v","e"," ","c","o","m","b"," ","m","e","n","u"," ","b","o","n","d"," ","c","o","i","n"," ","m","v"] },
  20:{ title:"Final Test", subtitle:"Complete the bottom row challenge.", target:["v","o","i","c","e"," ","c","o","n","v","e","x"," ","z","e","b","r","a"," ","m","a","x","i","m","u","m"," ","z","e","r","o"," "] }
};

const lesson = lessons[level] || lessons[1];
const target = lesson.target;

document.getElementById("lessonTitle").innerText = lesson.title;
document.getElementById("lessonSubtitle").innerText = lesson.subtitle;
document.getElementById("levelNumber").innerText = "Level " + level;

let savedStars = localStorage.getItem("bottomLevel" + level + "Stars");
if (savedStars) {
  document.getElementById("topStars").innerText = savedStars;
}

// Letter Boxes Render
let lettersHTML = "";
for (let i = 0; i < target.length; i++) {
  lettersHTML += `<div class="letter-card ${i === 0 ? "active" : ""}" id="l${i}">${target[i] === " " ? "␣" : target[i]}</div>`;
}
document.getElementById("lettersRow").innerHTML = lettersHTML;

const input = document.getElementById("typingInput");
let current = 0;
let mistakes = 0;
let startTime = null;
let timerStarted = false;

// Time Tracker
setInterval(function () {
  if (!timerStarted) return;
  let seconds = Math.floor((Date.now() - startTime) / 1000);
  let mins = Math.floor(seconds / 60);
  let secs = seconds % 60;
  document.getElementById("time").innerText = String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
}, 1000);

// Keypad Highlight
function updateKeyboardHighlight(expectedChar) {
  document.querySelectorAll(".key-cap").forEach(k => k.classList.remove("key-active"));
  if (!expectedChar) return;
  const keyEl = document.querySelector(`.key-cap[data-key="${expectedChar.toLowerCase()}"]`);
  if (keyEl) keyEl.classList.add("key-active");
}

updateKeyboardHighlight(target[0]);

// Typing Logic
input.addEventListener("input", async function () {
  if (!timerStarted) {
    startTime = Date.now();
    timerStarted = true;
  }

  mistakes = 0;
  const value = input.value;
  current = value.length;

  for (let i = 0; i < target.length; i++) {
    const el = document.getElementById("l" + i);
    if (el) el.classList.remove("active", "correct", "wrong");
  }

  for (let i = 0; i < value.length; i++) {
    const el = document.getElementById("l" + i);
    if (el) {
      if (value[i] === target[i]) {
        el.classList.add("correct");
      } else {
        el.classList.add("wrong");
        mistakes++;
      }
    }
  }

  if (current < target.length) {
    const nextEl = document.getElementById("l" + current);
    if (nextEl) nextEl.classList.add("active");
    updateKeyboardHighlight(target[current]);
  }

  document.getElementById("progress").innerText = current + " / " + target.length;
  document.getElementById("mistakes").innerText = mistakes;

  let accuracy = 100;
  if (current > 0) {
    accuracy = Math.round(((current - mistakes) / current) * 100);
  }
  document.getElementById("accuracy").innerText = accuracy + "%";

  let elapsedMinutes = (Date.now() - startTime) / 60000;
  if (elapsedMinutes > 0) {
    let correctCharacters = Math.max(0, current - mistakes);
    let wpm = Math.round((correctCharacters / 5) / elapsedMinutes);
    document.getElementById("wpm").innerText = wpm;
  }

  // Smooth Horizontal Scroll
  const activeLetter = document.getElementById("l" + current);
  const lettersContainer = document.querySelector(".letters-row");
  if (activeLetter && lettersContainer) {
    const containerWidth = lettersContainer.offsetWidth;
    const letterLeft = activeLetter.offsetLeft;
    const letterWidth = activeLetter.offsetWidth;
    lettersContainer.scrollLeft = letterLeft - (containerWidth / 2) + (letterWidth / 2);
  }

  // Level Complete Check
  if (current === target.length) {
    let unlocked = parseInt(localStorage.getItem("bottomRowCurrentLevel") || 1);
    if (level >= unlocked) {
      localStorage.setItem("bottomRowCurrentLevel", level + 1);
    }

    let stars = "⭐⭐⭐";
    if (mistakes >= 3) stars = "⭐";
    else if (mistakes >= 1) stars = "⭐⭐";

    document.getElementById("resultAccuracy").innerText = document.getElementById("accuracy").innerText;
    document.getElementById("resultMistakes").innerText = document.getElementById("mistakes").innerText;
    document.getElementById("resultWpm").innerText = document.getElementById("wpm").innerText;
    document.getElementById("resultTime").innerText = document.getElementById("time").innerText;

    if (accuracy < 80) {
      document.getElementById("popupTitle").innerText = "❌ Level Incomplete";
      document.getElementById("starRating").innerText = "❌";
      document.getElementById("performanceBadge").innerText = "Practice Again (Need 80%+)";
      document.getElementById("nextBtn").classList.add("hidden");
    } else {
      document.getElementById("popupTitle").innerText = "🎉 Level Complete!";
      document.getElementById("starRating").innerText = stars;
      document.getElementById("performanceBadge").innerText = (accuracy === 100 && mistakes === 0) ? "🏆 PERFECT RUN" : "✅ Passed";
      document.getElementById("nextBtn").classList.remove("hidden");
    }

    localStorage.setItem("bottomLevel" + level + "Stars", stars);
    localStorage.setItem("bottomLevel" + level + "Score", accuracy + "%");

    // Firebase Sync
    const uid = localStorage.getItem("tn_uid") || (auth.currentUser && auth.currentUser.uid);
    if (uid) {
      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const oldProgress = userSnap.data()?.progress?.bottomrow || 1;
          await updateDoc(userRef, {
            "progress.bottomrow": Math.max(oldProgress, level + 1)
          });
        }
      } catch (err) {
        console.warn("Bottom row progress sync note:", err);
      }
    }

    document.getElementById("popup").classList.remove("hidden");
  }
});

// Modal Actions
document.getElementById("restartBtn")?.addEventListener("click", () => location.reload());
document.getElementById("backBtn")?.addEventListener("click", () => window.location.href = "bottomrow.html");
document.getElementById("nextBtn")?.addEventListener("click", () => window.location.href = "bottomrowlevel.html?id=" + (level + 1));

// CapsLock Observer
document.addEventListener("keydown", function (event) {
  const capsWarning = document.getElementById("capsWarning");
  if (capsWarning) {
    if (event.getModifierState("CapsLock")) {
      capsWarning.classList.remove("hidden");
    } else {
      capsWarning.classList.add("hidden");
    }
  }
});