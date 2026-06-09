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
setDoc
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

/* SAVE USER TO FIRESTORE */
console.log("Before Save");
await setDoc(
doc(
db,
"users",
user.uid
),
{
name:
user.displayName,

email:
user.email,

photo:
user.photoURL,

lastLogin:
new Date()
.toISOString()

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

loginBtn.onclick =
function(){

window.location.href =
"profile.html";

};

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

window.location.href =
"profile.html";

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

loginBtn.onclick =
function(){

window.location.href =
"profile.html";

};

}

}

}
);

console.log(
"Firestore Saved Successfully"
);
