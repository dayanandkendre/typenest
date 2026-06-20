import { auth, db } from "./firebase-config.js";

import {
GoogleAuthProvider,
signInWithPopup,
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

localStorage.removeItem("currentLevel");
localStorage.removeItem("topRowCurrentLevel");
localStorage.removeItem("bottomRowCurrentLevel");
localStorage.removeItem("wordsCurrentLevel");
localStorage.removeItem("numbersCurrentLevel");
localStorage.removeItem("advancedCurrentLevel");
localStorage.removeItem("sectionUnlocked");
  
/* SAVE USER TO FIRESTORE */
console.log("Before Save");
await setDoc(
doc(
db,
"users",
user.uid
),
{
name:user.displayName,

email:user.email,

photo:user.photoURL,

lastLogin:
new Date()
.toISOString(),

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
{
merge:true
}
);
console.log("After Save");
/* SAVE LOCAL */

localStorage.setItem(
"userName",
user.displayName
);

localStorage.setItem(
"userEmail",
user.email
);

localStorage.setItem(
"userPhoto",
user.photoURL
);

/* UI UPDATE */
  

const loginBtn =
document.getElementById(
"loginBtn"
);

if(loginBtn){

loginBtn.textContent =
"👤 " +
user.displayName;

loginBtn.removeAttribute(
"onclick"
);

}

const loginModal =
document.getElementById(
"loginModal"
);

if(loginModal){

    loginModal.style.display =
    "none";

} 

alert(
"Welcome " +
user.displayName
);

const selectedLevel =
localStorage.getItem(
"selectedLevel"
);

if(selectedLevel){

localStorage.removeItem(
"selectedLevel"
);

window.location.href =
"level.html?id=" +
selectedLevel;

}
else{

 window.location.reload();
  
}
  
}
catch(error){

console.error(
error
);

alert(
"Login Failed"
);

}

});


onAuthStateChanged(
auth,
(user)=>{

if(user){

console.log(
"Logged In:",
user.displayName
);

const loginBtn =
document.getElementById(
"loginBtn"
);

if(loginBtn){

loginBtn.textContent =
"👤 " +
user.displayName;

loginBtn.removeAttribute(
"onclick"
);

loginBtn.dataset.loggedin =
"true";

}

}

}
);

console.log(
"Firestore Saved Successfully"
);

const loginBtn =
document.getElementById(
"loginBtn"
);

const dropdownMenu =
document.getElementById(
"dropdownMenu"
);

if(loginBtn && dropdownMenu){

loginBtn.addEventListener(
"click",
function(e){

if(
loginBtn.dataset.loggedin
!== "true"
){
return;
}

e.preventDefault();

e.stopPropagation();

dropdownMenu.classList.toggle(
"show"
);

});

document.addEventListener(
"click",
function(){

dropdownMenu.classList.remove(
"show"
);

});
  
}

const logoutDropdown =
document.getElementById(
"logoutDropdown"
);

if(logoutDropdown){

logoutDropdown.addEventListener(
"click",
async function(e){

e.preventDefault();

await signOut(auth);

window.location.href =
"index.html";

});

}
