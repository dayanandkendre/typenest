import { db } from "./firebase-config.js";

import {
collection,
addDoc,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const sendBtn =
document.getElementById("sendBtn");

sendBtn.addEventListener(
"click",
async () => {

const name =
document.getElementById("name").value.trim();

const email =
document.getElementById("email").value.trim();

const message =
document.getElementById("message").value.trim();

if(
!name ||
!email ||
!message
){

alert("Please fill all fields");
return;

}

try{

await addDoc(
collection(db,"messages"),
{
name,
email,
message,
createdAt:serverTimestamp()
}
);

alert(
"Thank you! Your message has been sent."
);

document.getElementById("name").value="";
document.getElementById("email").value="";
document.getElementById("message").value="";

}
catch(error){

console.error(error);

alert(
"Failed to send message."
);

}

});
