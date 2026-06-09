import { auth }
from "./firebase-config.js";

import {
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

onAuthStateChanged(
auth,
(user)=>{

const loginBtn =
document.getElementById(
"loginBtn"
);

if(!loginBtn){
return;
}

if(user){

loginBtn.textContent =
"👤 " +
user.displayName;

loginBtn.href =
"profile.html";

}
else{

loginBtn.textContent =
"Login";

loginBtn.href =
"#";

}

});