import {
initializeApp
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {

  // tuza firebase config

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const sendBtn =
document.getElementById("sendBtn");

sendBtn.addEventListener(
"click",
async () => {

const name =
document.getElementById("name").value;

const email =
document.getElementById("email").value;

const message =
document.getElementById("message").value;

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
name:name,
email:email,
message:message,
createdAt:serverTimestamp()
}
);

alert("Message sent successfully!");

document.getElementById("name").value="";
document.getElementById("email").value="";
document.getElementById("message").value="";

}
catch(error){

alert("Error sending message");

console.error(error);

}

});