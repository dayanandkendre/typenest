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
setDoc,
getDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const provider =
new GoogleAuthProvider();

/* =========================================================
   १. 🌐 GOOGLE SIGN-IN LOGIC
========================================================= */
const googleBtn = document.getElementById("googleLoginBtn");
if (googleBtn) {
    googleBtn.addEventListener("click", async function(){
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            localStorage.setItem("userUID", user.uid);

            // सर्व लेव्हल्सचा लोकल स्टोरेज डेटा साफ करणे
            clearLocalStorageData();
              
            /* SAVE USER TO FIRESTORE */
            console.log("Before Save");
            await saveUserToDatabase(user);
            console.log("After Save");

            /* SAVE LOCAL & UPDATE UI */
            completeLoginSession(user);
        }
        catch(error){
            console.error(error);
            alert("Login Failed");
        }
    });
}

/* =========================================================
   २. ✉️ EMAIL & PASSWORD SIGN-IN LOGIC
========================================================= */
// HTML मधील डुप्लिकेट आयडी टाळण्यासाठी आपण डायरेक्ट पॉपअपच्या आतील बटण हुडकून काढू
const popupBox = document.querySelector(".login-box");
if (popupBox) {
    const emailLoginBtn = popupBox.querySelector("button"); // पॉपअपच्या आतील लॉगिन बटण
    
    if (emailLoginBtn) {
        emailLoginBtn.addEventListener("click", async function(e){
            e.preventDefault();
            
            const emailInput = document.getElementById("email"); // HTML मधील आयडी
            const passwordInput = document.getElementById("password"); // HTML मधील आयडी
            
            if(!emailInput || !passwordInput) {
                alert("Input fields missing in HTML! ⚠️");
                return;
            }
            
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            
            if(email === "" || password === ""){
                alert("Please enter both email and password! ⚠️");
                return;
            }
            
            try {
                // फायरबेस ईमेल ऑथेंटिकेशन इंजिन
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                localStorage.setItem("userUID", user.uid);
                
                // सर्व लेव्हल्सचा लोकल स्टोरेज डेटा साफ करणे
                clearLocalStorageData();
                
                /* SAVE USER TO FIRESTORE */
                await saveUserToDatabase(user);
                
                /* SAVE LOCAL & UPDATE UI */
                completeLoginSession(user);
            } 
            catch(error) {
                console.error(error);
                alert("Login Failed: " + error.message);
            }
        });
    }
}

/* =========================================================
   🛠️ REUSABLE HELPER LOGIC FUNCTIONS
========================================================= */

function clearLocalStorageData() {
    localStorage.removeItem("hindiHomeCurrentLevel");
    localStorage.removeItem("hindiToprowCurrentLevel");
    localStorage.removeItem("hindiBottomrowCurrentLevel");
    localStorage.removeItem("hindiWordsCurrentLevel");
    localStorage.removeItem("hindiNumbersCurrentLevel");
    localStorage.removeItem("hindiAdvancedCurrentLevel");
    localStorage.removeItem("hindiSectionUnlocked");

    for(let i=1;i<=20;i++){
        localStorage.removeItem("hindiHomeLevel"+i+"Stars");
        localStorage.removeItem("hindiHomeLevel"+i+"Score");
        localStorage.removeItem("hindiToprowLevel"+i+"Stars");
        localStorage.removeItem("hindiToprowLevel"+i+"Score");
        localStorage.removeItem("hindiBottomrowLevel"+i+"Stars");
        localStorage.removeItem("hindiBottomrowLevel"+i+"Score");
        localStorage.removeItem("hindiWordsLevel"+i+"Stars");
        localStorage.removeItem("hindiWordsLevel"+i+"Score");
        localStorage.removeItem("hindiNumbersLevel"+i+"Stars");
        localStorage.removeItem("hindiNumbersLevel"+i+"Score");
        localStorage.removeItem("hindiAdvancedLevel"+i+"Stars");
        localStorage.removeItem("hindiAdvancedLevel"+i+"Score");
        localStorage.removeItem("hindiBottomrowLevel"+i+"Badge");
        localStorage.removeItem("hindiWordsLevel"+i+"Badge");
        localStorage.removeItem("hindiNumbersLevel"+i+"Badge");
        localStorage.removeItem("hindiAdvancedLevel"+i+"Badge");
    }
}

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
            progress: {
                home: 1,
                toprow: 1,
                bottomrow: 1,
                words: 1,
                numbers: 1,
                advanced: 1
            }
        },
        { merge: true }
    );
}

function completeLoginSession(user) {
    const finalName = user.displayName || user.email.split('@')[0];
    
    localStorage.setItem("userName", finalName);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userPhoto", user.photoURL || "");

    const loginBtn = document.getElementById("loginBtn");
    if(loginBtn){
        loginBtn.textContent = "👤 " + finalName;
        loginBtn.removeAttribute("onclick");
    }

    const mobileLoginBtn = document.getElementById("mobileLoginBtn");
    if(mobileLoginBtn){
        mobileLoginBtn.textContent = "👤 " + finalName;
        mobileLoginBtn.removeAttribute("onclick");
        mobileLoginBtn.href = "profile.html";
    }
  
    const loginModal = document.getElementById("loginModal");
    if(loginModal){
        loginModal.style.display = "none";
    } 

    alert("Welcome " + finalName);

    const selectedLevel = localStorage.getItem("hindiSelectedLevel");
    if(selectedLevel){
        localStorage.removeItem("hindiSelectedLevel");
        window.location.href = "level.html?id=" + selectedLevel;
    } else {
        window.location.reload();
    }
}

/* =========================================================
   ३. 🔄 ON AUTH STATE CHANGED & DROPDOWN ENGINE
========================================================= */
onAuthStateChanged(auth, (user)=>{
    if(user){
        const finalName = user.displayName || user.email.split('@')[0];
        console.log("Logged In:", finalName);

        const loginBtn = document.getElementById("loginBtn");
        if(loginBtn){
            loginBtn.textContent = "👤 " + finalName;
            loginBtn.removeAttribute("onclick");
            loginBtn.dataset.loggedin = "true";
        }

        const mobileLoginBtn = document.getElementById("mobileLoginBtn");
        if(mobileLoginBtn){
            mobileLoginBtn.textContent = "👤 " + finalName;
            mobileLoginBtn.dataset.loggedin = "true";
            mobileLoginBtn.removeAttribute("onclick");
            mobileLoginBtn.href = "profile.html";
        }
    }
});

const loginBtnUi = document.getElementById("loginBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

if(loginBtnUi && dropdownMenu){
    loginBtnUi.addEventListener("click", function(e){
        if(loginBtnUi.dataset.loggedin !== "true"){ return; }
        e.preventDefault();
        e.stopPropagation();
        dropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", function(){
        dropdownMenu.classList.remove("show");
    });
}

const logoutDropdown = document.getElementById("logoutDropdown");
if(logoutDropdown){
    logoutDropdown.addEventListener("click", async function(e){
        e.preventDefault();
        await signOut(auth);
        localStorage.removeItem("userUID");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userPhoto");  
        window.location.href = "../index.html";
    });
}
