// learn/toprow.js - Top Row Level Progression Engine with Safe Firebase Sync
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
   LESSON DATA (ALL 20 TOP ROW LEVELS INTACT)
========================================= */
const lessons = {
  1:{ title:"R U Introduction", subtitle:"Learn the top row keys R and U.", target:["r","u","r","u"," ","r","u","r","u"," ","r","r","u","u"," ","u","u","r","r"," ","r","u","u","r"," ","u","r","r","u"," ","r","u"] },
  2:{ title:"Keys R & U", subtitle:"Practice repeated R and U keys.", target:["r","r","u","u"," ","r","r","u","u"," ","r","u","r","u"," ","u","r","u","r"," ","r","r","r","u"," ","u","u","u","r"," ","r","u"] },
  3:{ title:"RU Practice", subtitle:"Build rhythm with RU combinations.", target:["r","u","u","r"," ","r","u","u","r"," ","u","r","r","u"," ","u","r","r","u"," ","r","r","u","u"," ","u","u","r","r"," ","r","u"] },
  4:{ title:"Keys E & I", subtitle:"Learn E and I keys.", target:["e","i","e","i"," ","e","i","e","i"," ","e","e","i","i"," ","i","i","e","e"," ","e","i","i","e"," ","i","e","e","i"," ","e","i"] },
  5:{ title:"EI Practice", subtitle:"Practice E and I combinations.", target:["e","e","i","i"," ","e","e","i","i"," ","e","i","e","i"," ","i","e","i","e"," ","e","e","e","i"," ","i","i","i","e"," ","e","i"] },
  6:{ title:"REUI Mix", subtitle:"Mix R E U I keys.", target:["r","e","u","i"," ","r","e","u","i"," ","e","i","r","u"," ","i","e","u","r"," ","r","r","e","e"," ","u","u","i","i"," ","r","u"] },
  7:{ title:"Keys W & O", subtitle:"Learn W and O keys.", target:["w","o","w","o"," ","w","o","w","o"," ","w","w","o","o"," ","o","o","w","w"," ","w","o","o","w"," ","o","w","w","o"," ","w","o"] },
  8:{ title:"WO Practice", subtitle:"Practice W and O combinations.", target:["w","w","o","o"," ","w","w","o","o"," ","w","o","w","o"," ","o","w","o","w"," ","w","w","w","o"," ","o","o","o","w"," ","w","o"] },
  9:{ title:"Top Row Mix", subtitle:"Mix W O R E keys.", target:["w","o","r","e"," ","w","o","r","e"," ","o","r","e","w"," ","e","r","o","w"," ","w","w","o","o"," ","r","r","e","e"," ","w","e"] },
  10:{ title:"Keys Q & P", subtitle:"Learn Q and P keys.", target:["q","p","q","p"," ","q","p","q","p"," ","q","q","p","p"," ","p","p","q","q"," ","q","p","p","q"," ","p","q","q","p"," ","q","p"] },
  11:{ title:"QP Practice", subtitle:"Practice Q and P combinations.", target:["q","q","p","p"," ","q","q","p","p"," ","q","p","q","p"," ","p","q","p","q"," ","q","q","q","p"," ","p","p","p","q"," ","q","p"] },
  12:{ title:"Top Row Review", subtitle:"Review all top row keys.", target:["q","w","e","r"," ","u","i","o","p"," ","q","w","e","r"," ","u","i","o","p"," ","p","o","i","u"," ","r","e","w","q"," ","q","p"] },
  13:{ title:"Left Hand Practice", subtitle:"Practice Q W E R keys.", target:["q","w","e","r"," ","q","w","e","r"," ","r","e","w","q"," ","r","e","w","q"," ","q","q","w","w"," ","e","e","r","r"," ","q","r"] },
  14:{ title:"Right Hand Practice", subtitle:"Practice U I O P keys.", target:["u","i","o","p"," ","u","i","o","p"," ","p","o","i","u"," ","p","o","i","u"," ","u","u","i","i"," ","o","o","p","p"," ","u","p"] },
  15:{ title:"Left Drill", subtitle:"Build speed with QWER.", target:["q","e","w","r"," ","q","r","w","e"," ","e","w","r","q"," ","r","w","e","q"," ","q","w","e","r"," ","r","e","w","q"," ","q","e"] },
  16:{ title:"Right Drill", subtitle:"Build speed with UIOP.", target:["u","o","i","p"," ","u","p","i","o"," ","o","i","p","u"," ","p","i","o","u"," ","u","i","o","p"," ","p","o","i","u"," ","u","o"] },
  17:{ title:"Top Row Mix", subtitle:"Mixed top row practice.", target:["q","u","w","i"," ","e","o","r","p"," ","u","q","i","w"," ","o","e","p","r"," ","q","w","e","r"," ","u","i","o","p"," ","q","u"] },
  18:{ title:"Advanced Mix", subtitle:"Advanced top row combinations.", target:["r","u","e","i"," ","w","o","q","p"," ","p","q","o","w"," ","i","e","u","r"," ","q","u","w","i"," ","e","o","r","p"," ","r","e"] },
  19:{ title:"Top Row Words", subtitle:"Top row word practice.", target:["t","y","p","e"," ","r","o","u","t","e"," ","p","o","w","e","r"," ","w","r","i","t","e"," ","o","u","t","p","u","t"," ","p","i"] },
  20:{ title:"Final Test", subtitle:"Complete the top row challenge.", target:["p","r","o","p","e","r"," ","q","u","i","e","t"," ","p","o","e","t","r","y"," ","e","q","u","i","p"," ","w","o","r","r","y"," "] }
};

const lesson = lessons[level] || lessons[1];
const target = lesson.target;

document.getElementById("lessonTitle").innerText = lesson.title;
document.getElementById("lessonSubtitle").innerText = lesson.subtitle;
document.getElementById("levelNumber").innerText = "Level " + level;

let savedStars = localStorage.getItem("toprowLevel" + level + "Stars");
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
    let unlocked = parseInt(localStorage.getItem("topRowCurrentLevel") || 1);
    if (level >= unlocked) {
      localStorage.setItem("topRowCurrentLevel", level + 1);
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

    localStorage.setItem("toprowLevel" + level + "Stars", stars);
    localStorage.setItem("toprowLevel" + level + "Score", accuracy + "%");

    // Firebase Sync
    const uid = localStorage.getItem("tn_uid") || (auth.currentUser && auth.currentUser.uid);
    if (uid) {
      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const oldProgress = userSnap.data()?.progress?.toprow || 1;
          await updateDoc(userRef, {
            "progress.toprow": Math.max(oldProgress, level + 1)
          });
        }
      } catch (err) {
        console.warn("Top row progress sync note:", err);
      }
    }

    document.getElementById("popup").classList.remove("hidden");
  }
});

// Modal Actions
document.getElementById("restartBtn")?.addEventListener("click", () => location.reload());
document.getElementById("backBtn")?.addEventListener("click", () => window.location.href = "toprow.html");
document.getElementById("nextBtn")?.addEventListener("click", () => window.location.href = "toprowlevel.html?id=" + (level + 1));

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