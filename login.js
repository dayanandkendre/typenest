import { auth } from "./firebase-config.js";

import {
GoogleAuthProvider,
signInWithPopup,
onAuthStateChanged,
signOut
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


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

document
.getElementById(
"loginModal"
)
.style.display =
"none";

alert(
"Welcome " +
user.displayName
);

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

}

}
);
