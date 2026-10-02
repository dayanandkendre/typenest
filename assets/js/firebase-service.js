// assets/js/firebase-service.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  serverTimestamp 
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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Google 1-Click Login
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check ki user profile exist ahe ka, nasel tar create kara
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName || "Typist",
        email: user.email,
        photoURL: user.photoURL || "",
        topWpm: 0,
        avgAcc: 100,
        testsCompleted: 0,
        createdAt: serverTimestamp()
      });
    }

    // Modal band kara
    const loginModal = document.getElementById("loginModal");
    if (loginModal) loginModal.classList.add("hidden");

    return user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    alert("Sign-in failed. Please try again.");
  }
}

// Logout Function
export async function logoutUser() {
  await signOut(auth);
  window.location.reload();
}

// User state observer (Navbar updates across all pages)
export function initAuthObserver() {
  onAuthStateChanged(auth, async (user) => {
    const userNavText = document.getElementById("userNavText");
    const loginBtn = document.getElementById("loginBtn");
    const mobileLoginBtn = document.getElementById("mobileLoginBtn");
    const mobileNavUserText = document.getElementById("mobileNavUserText");

    if (user) {
      const displayName = user.displayName || user.email.split("@")[0];
      const avatarHTML = user.photoURL 
        ? `<img src="${user.photoURL}" class="w-5 h-5 rounded-full border border-indigo-300 object-cover">`
        : `<span>👤</span>`;

      // Update Desktop Navbar Button
      if (loginBtn) {
        loginBtn.innerHTML = `${avatarHTML}<span id="userNavText">${displayName}</span>`;
        loginBtn.onclick = () => window.location.href = "profile.html";
      }

      // Update Mobile Drawer Button
      if (mobileLoginBtn && mobileNavUserText) {
        mobileLoginBtn.innerHTML = `${avatarHTML}<span>${displayName}</span>`;
        mobileLoginBtn.onclick = () => window.location.href = "profile.html";
      }

      localStorage.setItem("tn_username", displayName);
      localStorage.setItem("tn_uid", user.uid);
    } else {
      localStorage.removeItem("tn_uid");
    }
  });
}

// Typing result Firestore madhe auto-save karne
export async function saveTypingResult({ wpm, accuracy, preset }) {
  const user = auth.currentUser;
  if (!user) {
    // Guest user asel tar localstorage madhe theva
    localStorage.setItem("tn_last_wpm", wpm);
    localStorage.setItem("tn_last_acc", accuracy);
    return;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const currentData = userSnap.exists() ? userSnap.data() : { topWpm: 0, testsCompleted: 0, avgAcc: 100 };

    const newTestsCount = (currentData.testsCompleted || 0) + 1;
    const newTopWpm = Math.max(currentData.topWpm || 0, wpm);
    const prevTotalAcc = (currentData.avgAcc || 100) * (currentData.testsCompleted || 0);
    const newAvgAcc = Math.round((prevTotalAcc + accuracy) / newTestsCount);

    // 1. Update user main aggregate profile
    await updateDoc(userRef, {
      topWpm: newTopWpm,
      avgAcc: newAvgAcc,
      testsCompleted: newTestsCount,
      lastActive: serverTimestamp()
    });

    // 2. Add history session log
    await addDoc(collection(db, "users", user.uid, "sessions"), {
      wpm,
      accuracy,
      preset: preset || "1 min Test",
      createdAt: serverTimestamp()
    });

    // 3. Add to global leaderboard collection
    await setDoc(doc(db, "leaderboard", user.uid), {
      name: user.displayName || "Typist",
      wpm: newTopWpm,
      accuracy: newAvgAcc,
      preset: preset || "Sprint Challenge",
      photoURL: user.photoURL || "",
      updatedAt: serverTimestamp()
    });

    localStorage.setItem("tn_last_wpm", newTopWpm);
    localStorage.setItem("tn_last_acc", newAvgAcc);
  } catch (error) {
    console.error("Error saving typing progress:", error);
  }
}

// Profile Page Data Load
export async function loadUserProfile() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      // User login nasel tar login modal open kara kiva notice dakhva
      return;
    }

    const nameDisplay = document.getElementById("profileNameDisplay");
    const nameInput = document.getElementById("usernameInput");
    const avatarEl = document.getElementById("profileBigAvatar");
    const statWpm = document.getElementById("statTopWPM");
    const statAcc = document.getElementById("statAvgAcc");
    const statCount = document.getElementById("statTestsCount");

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();
      if (nameDisplay) nameDisplay.innerText = data.displayName || user.displayName;
      if (nameInput) nameInput.value = data.displayName || user.displayName;
      if (statWpm) statWpm.innerText = data.topWpm || 0;
      if (statAcc) statAcc.innerText = `${data.avgAcc || 100}%`;
      if (statCount) statCount.innerText = data.testsCompleted || 0;

      if (avatarEl) {
        if (data.photoURL || user.photoURL) {
          avatarEl.innerHTML = `<img src="${data.photoURL || user.photoURL}" class="w-full h-full rounded-[14px] object-cover">`;
        } else {
          avatarEl.innerText = (data.displayName || "TY").substring(0, 2).toUpperCase();
        }
      }
    }

    // Sessions History Load karne
    const sessionList = document.getElementById("sessionList");
    if (sessionList) {
      const q = query(collection(db, "users", user.uid, "sessions"), orderBy("createdAt", "desc"), limit(5));
      const querySnap = await getDocs(q);

      if (!querySnap.empty) {
        sessionList.innerHTML = "";
        querySnap.forEach((docItem) => {
          const s = docItem.data();
          const tr = document.createElement("div");
          tr.className = "py-3 flex items-center justify-between";
          tr.innerHTML = `
            <span class="text-slate-400"><i class="fa-regular fa-clock mr-2"></i>${s.preset}</span>
            <span class="text-indigo-400 font-bold text-sm">${s.wpm} WPM <span class="text-emerald-400 text-xs font-normal">(${s.accuracy}% Accuracy)</span></span>
          `;
          sessionList.appendChild(tr);
        });
      }
    }
  });
}

// Global Leaderboard Fetch
export async function loadGlobalLeaderboard() {
  const tbody = document.getElementById("leaderboardRows");
  if (!tbody) return;

  try {
    const q = query(collection(db, "leaderboard"), orderBy("wpm", "desc"), limit(20));
    const snap = await getDocs(q);

    if (snap.empty) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-slate-500">No records found yet. Be the first one to set a record!</td></tr>`;
      return;
    }

    tbody.innerHTML = "";
    let rank = 1;
    snap.forEach((docItem) => {
      const row = docItem.data();
      let badge = "Practitioner";
      if (row.wpm >= 100) badge = "Grandmaster";
      else if (row.wpm >= 80) badge = "Master";
      else if (row.wpm >= 60) badge = "Professional";
      else if (row.wpm >= 40) badge = "Intermediate";

      const tr = document.createElement("tr");
      tr.className = "hover:bg-slate-800/40 transition";
      tr.innerHTML = `
        <td class="py-3.5 px-6 font-bold flex items-center gap-2">
          ${rank === 1 ? '<i class="fa-solid fa-crown text-amber-400 text-sm"></i>' : `#${rank}`}
        </td>
        <td class="py-3.5 px-6 font-sans font-medium text-white flex items-center gap-2.5">
          ${row.photoURL ? `<img src="${row.photoURL}" class="w-6 h-6 rounded-full object-cover">` : `<span class="w-6 h-6 rounded-full bg-indigo-600 text-[10px] flex items-center justify-center font-bold">TN</span>`}
          <span>${row.name}</span>
        </td>
        <td class="py-3.5 px-6 text-slate-400 font-sans text-xs">${row.preset || "Classic Test"}</td>
        <td class="py-3.5 px-6 text-right font-extrabold text-indigo-400 text-base">${row.wpm}</td>
        <td class="py-3.5 px-6 text-right text-emerald-400">${row.accuracy}%</td>
        <td class="py-3.5 px-6 text-right">
          <span class="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
            badge === 'Grandmaster' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
            badge === 'Master' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
            'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
          }">
            ${badge}
          </span>
        </td>
      `;
      tbody.appendChild(tr);
      rank++;
    });
  } catch (err) {
    console.error("Leaderboard load error:", err);
  }
}