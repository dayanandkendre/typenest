// learn/level.js - Home Row Level Progression Engine with Safe Firebase Sync
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
   LESSON DATA (ALL 20 LEVELS INTACT)
========================================= */
const lessons = {
  1:{ title:"F J Introduction", subtitle:"Learn the home keys F and J.", target:["f","j","f","j"," ","f","j","f","j"," ","f","f","j","j"," ","j","j","f","f"," ","f","j","j","f"," ","j","f","f","j"," ","f","j"] },
  2:{ title:"Keys F & J", subtitle:"Practice repeated F and J keys.", target:["f","f","j","j"," ","f","f","j","j"," ","f","j","f","j"," ","j","f","j","f"," ","f","f","f","j"," ","j","j","j","f","j","f","j"] },
  3:{ title:"FJ Practice", subtitle:"Build rhythm with FJ combinations.", target:["f","j","j","f"," ","f","j","j","f"," ","j","f","f","j"," ","j","f","f","j"," ","f","f","j","j"," ","j","j","f","f"," ","f","j"] },
  4:{ title:"Space Bar", subtitle:"Learn using the space key.", target:["f"," ","j"," ","f"," ","j"," ","f","f"," ","j","j"," ","f","j"," ","j","f"," ","f"," ","j"," ","f","f"," ","j","j"," ","f","j"] },
  5:{ title:"Keys D & K", subtitle:"Introduce D and K keys.", target:["d","k","d","k"," ","d","k","d","k"," ","d","d","k","k"," ","k","k","d","d"," ","d","k","k","d"," ","k","d","d","k"," ","d","k"] },
  6:{ title:"Keys D & F", subtitle:"Practice D and F keys.", target:["d","f","d","f"," ","d","f","d","f"," ","d","d","f","f"," ","f","f","d","d"," ","d","f","f","d"," ","f","d","d","f"," ","d","f"] },
  7:{ title:"Keys J & K", subtitle:"Practice J and K keys.", target:["j","k","j","k"," ","j","k","j","k"," ","j","j","k","k"," ","k","k","j","j"," ","j","k","k","j"," ","k","j","j","k"," ","j","k"] },
  8:{ title:"DKF Practice", subtitle:"Mixed practice.", target:["d","k","f"," ","d","k","f"," ","f","k","d"," ","f","k","d"," ","d","f","k"," ","k","f","d"," ","d","d","k","k","f","f","d","k"] },
  9:{ title:"Keys S & L", subtitle:"Practice S and L keys.", target:["s","l","s","l"," ","s","l","s","l"," ","s","s","l","l"," ","l","l","s","s"," ","s","l","l","s"," ","l","s","s","l"," ","s","l"] },
  10:{ title:"Semicolon", subtitle:"Practice semicolon key.", target:[";",";",";",";"," ",";",";",";",";"," ",";",";",";",";"," ",";",";",";",";"," ",";",";",";",";"," ",";",";",";",";"," ",";",";"] },
  11:{ title:"All Home Keys", subtitle:"Home row practice.", target:["a","s","d","f"," ","j","k","l",";"," ","a","s","d","f"," ","j","k","l",";"," ","f","j","d","k"," ","s","l","a",";"," ","f","j"] },
  12:{ title:"Home Row Review", subtitle:"Final review.", target:["f","j","d","k"," ","s","l","a",";"," ","a","s","d","f"," ","j","k","l",";"," ",";","l","k","j"," ","f","d","s","a"," ","f","j"] },
  13:{ title:"Left Hand Practice", subtitle:"Practice A S D F keys.", target:["a","s","d","f"," ","a","s","d","f"," ","f","d","s","a"," ","f","d","s","a"," ","a","a","s","s"," ","d","d","f","f"," ","a","f"] },
  14:{ title:"Right Hand Practice", subtitle:"Practice J K L ; keys.", target:["j","k","l",";"," ","j","k","l",";"," ",";","l","k","j"," ",";","l","k","j"," ","j","j","k","k"," ","l","l",";",";"," ","j",";"] },
  15:{ title:"Left Hand Drill", subtitle:"Build speed with left hand.", target:["a","s","f","d"," ","a","f","s","d"," ","d","s","f","a"," ","f","s","a","d"," ","a","s","d","f"," ","f","d","s","a"," ","a","s"] },
  16:{ title:"Right Hand Drill", subtitle:"Build speed with right hand.", target:["j","k",";","l"," ","j",";","k","l"," ",";","l","k","j"," ","l","k",";","j"," ","j","k","l",";"," ",";","l","k","j"," ","j","k"] },
  17:{ title:"Home Row Mix 1", subtitle:"Mix both hands together.", target:["a","j","s","k"," ","d","l","f",";"," ","j","a","k","s"," ","l","d",";","f"," ","a","s","d","f"," ","j","k","l",";"," ","a","j"] },
  18:{ title:"Home Row Mix 2", subtitle:"Advanced home row combinations.", target:["f","j","d","k"," ","s","l","a",";"," ",";","a","l","s"," ","k","d","j","f"," ","a","j","s","k"," ","d","l","f",";"," ","f","j"] },
  19:{ title:"Home Row Words", subtitle:"Type real home row words.", target:["s","a","d"," ","a","s","k"," ","l","a","d"," ","f","a","d"," ","a","d","d"," ","a","l","l"," ","f","a","l","l"," ","s","a","d"] },
  20:{ title:"Final Test", subtitle:"Complete home row challenge.", target:["a","s","d","f"," ","j","k","l",";"," ","s","a","l","a","d"," ","f","l","a","s","h"," ","g","l","a","s","s"," ","d","a","d"," "] }
};

const lesson = lessons[level] || lessons[1];
const target = lesson.target;

document.getElementById("lessonTitle").innerText = lesson.title;
document.getElementById("lessonSubtitle").innerText = lesson.subtitle;
document.getElementById("levelNumber").innerText = "Level " + level;

let savedStars = localStorage.getItem("homeLevel" + level + "Stars");
if (savedStars) {
  document.getElementById("topStars").innerText = savedStars;
}

// Render Letter Boxes
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

// Keypad Highlight Logic
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

  // Smooth Center Scrolling
  const activeLetter = document.getElementById("l" + current);
  const lettersContainer = document.querySelector(".letters-row");
  if (activeLetter && lettersContainer) {
    const containerWidth = lettersContainer.offsetWidth;
    const letterLeft = activeLetter.offsetLeft;
    const letterWidth = activeLetter.offsetWidth;
    lettersContainer.scrollLeft = letterLeft - (containerWidth / 2) + (letterWidth / 2);
  }

  // Level Complete Handling
  if (current === target.length) {
    let unlocked = parseInt(localStorage.getItem("currentLevel") || 1);
    if (level >= unlocked) {
      localStorage.setItem("currentLevel", level + 1);
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

    localStorage.setItem("homeLevel" + level + "Stars", stars);
    localStorage.setItem("homeLevel" + level + "Score", accuracy + "%");

    // Firebase Sync for Logged in Typist
    const uid = localStorage.getItem("tn_uid") || (auth.currentUser && auth.currentUser.uid);
    if (uid) {
      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const oldProgress = userSnap.data()?.progress?.home || 1;
          await updateDoc(userRef, {
            "progress.home": Math.max(oldProgress, level + 1)
          });
        }
      } catch (err) {
        console.warn("Progress sync note:", err);
      }
    }

    document.getElementById("popup").classList.remove("hidden");
  }
});

// Modal Actions
document.getElementById("restartBtn")?.addEventListener("click", () => location.reload());
document.getElementById("backBtn")?.addEventListener("click", () => window.location.href = "learn.html");
document.getElementById("nextBtn")?.addEventListener("click", () => window.location.href = "level.html?id=" + (level + 1));

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