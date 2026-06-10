import { auth } from "./firebase-config.js";

import {

    onAuthStateChanged,
    signOut

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const userName =
document.getElementById("userName");

const userEmail =
document.getElementById("userEmail");

const profilePhoto =
document.getElementById("profilePhoto");

const logoutBtn =
document.getElementById("logoutBtn");

onAuthStateChanged(auth,(user)=>{

    if(!user){

        window.location.href =
        "login.html";

        return;

    }

    userName.textContent =
    user.displayName ||
    "TypeNest User";

    userEmail.textContent =
    user.email;

    if(user.photoURL){

        profilePhoto.src =
        user.photoURL;

    }

});

logoutBtn.addEventListener(
"click",
()=>{

    signOut(auth)
    .then(()=>{

        window.location.href =
        "index.html";

    });

});
