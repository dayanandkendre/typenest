// learn/learn.js - Home Row Level Progression and Firestore Sync
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

async function initLearnLevels() {
  let unlocked = parseInt(localStorage.getItem("currentLevel") || 1);
  const uid = localStorage.getItem("tn_uid") || (auth.currentUser && auth.currentUser.uid);

  // Firestore sync jar user login asel
  if (uid) {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const cloudProgress = userSnap.data()?.progress?.home || 1;
        unlocked = Math.max(unlocked, cloudProgress);
        localStorage.setItem("currentLevel", unlocked);
      }
    } catch (err) {
      console.warn("Cloud progress read note:", err);
    }
  }

  const completedCount = Math.min(unlocked - 1, 20);

  // Dashboard Stats update
  const progressCountEl = document.getElementById("progressCount");
  const progressFillEl = document.getElementById("progressFill");
  const bestStreakEl = document.getElementById("bestStreak");

  if (progressCountEl) progressCountEl.innerText = `${completedCount} / 20`;
  if (progressFillEl) progressFillEl.style.width = `${(completedCount / 20) * 100}%`;
  if (bestStreakEl) bestStreakEl.innerText = `${completedCount} Levels`;

  // Render 20 Level Cards
  for (let i = 1; i <= 20; i++) {
    const card = document.getElementById(`level${i}`);
    if (!card) continue;

    if (i <= unlocked) {
      card.classList.remove("locked");
      const lockIcon = card.querySelector(".lock-icon");
      if (lockIcon) lockIcon.classList.add("hidden");

      card.onclick = () => {
        window.location.href = `level.html?id=${i}`;
      };
    } else {
      card.classList.add("locked");
      const lockIcon = card.querySelector(".lock-icon");
      if (lockIcon) lockIcon.classList.remove("hidden");
      card.onclick = null;
    }

    // Saved Stats Display
    const stars = localStorage.getItem(`homeLevel${i}Stars`);
    const score = localStorage.getItem(`homeLevel${i}Score`);

    const starBox = document.getElementById(`stars${i}`);
    const scoreBox = document.getElementById(`score${i}`);

    if (stars && starBox) starBox.innerText = stars;
    if (score && scoreBox) scoreBox.innerText = score;
  }
}

document.addEventListener("DOMContentLoaded", initLearnLevels);