import {
auth
}
from "./firebase-config.js";

import {
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const certificateName =
document.getElementById(
"certificateName"
);

const completionDate =
document.getElementById(
"completionDate"
);

onAuthStateChanged(
auth,
(user)=>{

if(!user){

window.location.href =
"login.html";

return;

}

certificateName.textContent =
user.displayName ||
"TypeNest User";

const today =
new Date();

completionDate.textContent =
today.toLocaleDateString(
"en-GB"
);

}
);