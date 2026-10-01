import { auth, db } from "./firebase-config.js";

import {
GoogleAuthProvider,
signInWithPopup,
signInWithEmailAndPassword,
onAuthStateChanged,
signOut
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
doc,
setDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const provider = new GoogleAuthProvider();

/* =========================================================
   १. 🌐 GOOGLE SIGN-IN
========================================================= */
document.addEventListener("click", async function(e) {
    if (e.target.closest("#googleLoginBtn")) {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            localStorage.setItem("userUID", user.uid);

            await saveUserToDatabase(user);
            completeLoginSession(user);
        } catch(error) {
            console.error(error);
            alert("Login Failed: " + error.message);
        }
    }
});

/* =========================================================
   २. ✉️ EMAIL & PASSWORD SIGN-IN
========================================================= */
document.addEventListener("click", async function(e) {
    const popupBox = document.querySelector(".login-box");
    if (popupBox && e.target === popupBox.querySelector("button:not(#googleLoginBtn)")) {
        e.preventDefault();
        
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        
        if(!emailInput || !passwordInput) return;
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        if(email === "" || password === ""){
            alert("Please enter both email and password!");
            return;
        }
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            localStorage.setItem("userUID", user.uid);
            await saveUserToDatabase(user);
            completeLoginSession(user);
        } catch(error) {
            console.error(error);
            alert("Login Failed: " + error.message);
        }
    }
});

/* =========================================================
   🛠️ HELPER FUNCTIONS
========================================================= */
async function saveUserToDatabase(user) {
    const finalName = user.displayName || user.email.split('@')[0];
    await setDoc(
        doc(db, "users", user.uid),
        {
            name: finalName,
            email: user.email,
            photo: user.photoURL || "",
            lastLogin: new Date().toISOString(),
            testsTaken: 0,
            bestWpm: 0,
            bestAccuracy: 0,
            progress: { home: 1, toprow: 1, bottomrow: 1, words: 1, numbers: 1, advanced: 1 }
        },
        { merge: true }
    );
}

function completeLoginSession(user) {
    const finalName = user.displayName || user.email.split('@')[0];
    
    localStorage.setItem("userName", finalName);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userPhoto", user.photoURL || "");

    const modal = document.getElementById("loginModal");
    if (modal) modal.classList.add("hidden");

    alert("Welcome " + finalName + "!");
    window.location.reload();
}

function updateNavUserUI(name) {
    const navText = document.getElementById("userNavText");
    const loginBtn = document.getElementById("loginBtn");
    if (navText && loginBtn) {
        navText.textContent = name;
        loginBtn.classList.remove("bg-indigo-600");
        loginBtn.classList.add("bg-slate-800", "border", "border-slate-700");
    }

    const mobileNavText = document.getElementById("mobileNavUserText");
    if (mobileNavText) {
        mobileNavText.textContent = name;
    }
}

/* =========================================================
   ३. 🔄 AUTH STATE LISTENER & CLICK ACTION
========================================================= */
let isUserLoggedIn = false;

onAuthStateChanged(auth, (user)=>{
    if(user){
        isUserLoggedIn = true;
        const finalName = user.displayName || user.email.split('@')[0];
        localStorage.setItem("userUID", user.uid);
        updateNavUserUI(finalName);
    } else {
        isUserLoggedIn = false;
    }
});

// Click Handler: Login nasel tar Modal Popup ughda; Login asel tar Profile var ja
document.addEventListener("click", function(e) {
    const target = e.target.closest("#loginBtn, #mobileLoginBtn");
    if (target) {
        e.preventDefault();
        if (isUserLoggedIn) {
            window.location.href = "profile.html";
        } else {
            const modal = document.getElementById("loginModal");
            if (modal) modal.classList.remove("hidden");
        }
    }
});