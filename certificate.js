import {
doc,
getDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
db
}
from "./firebase-config.js";

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
async(user)=>{

if(!user){

window.location.href =
"login.html";

return;

}

const userRef =
doc(
db,
"users",
user.uid
);

const userSnap =
await getDoc(
userRef
);

if(!userSnap.exists()){

window.location.href =
"profile.html";

return;

}

const data =
userSnap.data();

const home =
data.progress?.home || 1;

const bottom =
data.progress?.bottomrow || 1;

const words =
data.progress?.words || 1;

const numbers =
data.progress?.numbers || 1;

const advanced =
data.progress?.advanced || 1;

const totalCompleted =

(home - 1) +
(bottom - 1) +
(words - 1) +
(numbers - 1) +
(advanced - 1);

const overallProgress =
Math.round(
(totalCompleted / 100) * 100
);

if(overallProgress < 100){

alert(
"Complete all levels to unlock certificate."
);

window.location.href =
"profile.html";

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
