import { auth, db } from "./firebase-config.js";

import {
GoogleAuthProvider,
signInWithPopup,
signInWithEmailAndPassword, // 👈 ईमेल पासवर्ड लॉगिनसाठी नवीन पद्धत
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
document
.getElementById(
"googleLoginBtn"
)
.addEventListener(
"click",
async function(){

try{

const result =
await signInWithPopup(
auth,
provider
);

const user =
result.user;
  localStorage.setItem(
"userUID",
user.uid
);

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

/* =========================================================
   २. ✉️ EMAIL & PASSWORD SIGN-IN LOGIC
========================================================= */
// टीप: तुझ्या HTML नुसार या आयडी नक्की तपासून घे भाऊ
const emailLoginBtn = document.getElementById("emailLoginBtn");
if(emailLoginBtn) {
    emailLoginBtn.addEventListener("click", async function(e){
        e.preventDefault();
        
        const emailInput = document.getElementById("emailInput");
        const passwordInput = document.getElementById("passwordInput");
        
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

/* =========================================================
   🛠️ REUSABLE HELPER LOGIC FUNCTIONS
========================================================= */

// लोकल स्टोरेजमधील लेव्हल्स आणि प्रगती साफ करण्यासाठी
function clearLocalStorageData() {
    localStorage.removeItem("currentLevel");
    localStorage.removeItem("topRowCurrentLevel");
    localStorage.removeItem("bottomRowCurrentLevel");
    localStorage.removeItem("wordsCurrentLevel");
    localStorage.removeItem("numbersCurrentLevel");
    localStorage.removeItem("advancedCurrentLevel");
    localStorage.removeItem("sectionUnlocked");

    for(let i=1;i<=20;i++){
        localStorage.removeItem("homeLevel"+i+"Stars");
        localStorage.removeItem("homeLevel"+i+"Score");
        localStorage.removeItem("toprowLevel"+i+"Stars");
        localStorage.removeItem("toprowLevel"+i+"Score");
        localStorage.removeItem("bottomLevel"+i+"Stars");
        localStorage.removeItem("bottomLevel"+i+"Score");
        localStorage.removeItem("wordsLevel"+i+"Stars");
        localStorage.removeItem("wordsLevel"+i+"Score");
        localStorage.removeItem("numbersLevel"+i+"Stars");
        localStorage.removeItem("numbersLevel"+i+"Score");
        localStorage.removeItem("advancedLevel"+i+"Stars");
        localStorage.removeItem("advancedLevel"+i+"Score");
        localStorage.removeItem("bottomLevel"+i+"Badge");
        localStorage.removeItem("wordsLevel"+i+"Badge");
        localStorage.removeItem("numbersLevel"+i+"Badge");
        localStorage.removeItem("advancedLevel"+i+"Badge");
    }
}

// युझर प्रोफाइल डेटा फायरबेसमध्ये सेव्ह करणे
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

// युझर सेशन पूर्ण करून UI अपडेट आणि रिडायरेक्ट करणे
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

    const selectedLevel = localStorage.getItem("selectedLevel");
    if(selectedLevel){
        localStorage.removeItem("selectedLevel");
        window.location.href = "level.html?id=" + selectedLevel;
    } else {
        window.location.reload();
    }
}

/* =========================================================
   ३. 🔄 ON AUTH STATE CHANGED & DROPDOWN ENGINE
========================================================= */
onAuthStateChanged(
auth,
(user)=>{

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

}
);

console.log("Firestore Saved Successfully");

const loginBtnUi = document.getElementById("loginBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

if(loginBtnUi && dropdownMenu){

loginBtnUi.addEventListener(
"click",
function(e){

if(
loginBtnUi.dataset.loggedin
!== "true"
){
return;
}

e.preventDefault();
e.stopPropagation();
dropdownMenu.classList.toggle("show");
});

document.addEventListener(
"click",
function(){
dropdownMenu.classList.remove("show");
});
  
}

const logoutDropdown = document.getElementById("logoutDropdown");
if(logoutDropdown){

logoutDropdown.addEventListener(
"click",
async function(e){

e.preventDefault();
await signOut(auth);

localStorage.removeItem("userUID");
localStorage.removeItem("userName");
localStorage.removeItem("userEmail");
localStorage.removeItem("userPhoto");  

window.location.href = "index.html";
});

}
