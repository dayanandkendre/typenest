import {
auth,
db
}
from "./firebase-config.js";

import {
doc,
getDoc,
collection,
getDocs
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

const testsTaken =
document.getElementById(
"testsTaken"
);

const bestWpm =
document.getElementById(
"bestWpm"
);

const bestAccuracy =
document.getElementById(
"bestAccuracy"
);

const logoutBtn =
document.getElementById("logoutBtn");

onAuthStateChanged(auth,
async (user)=>{

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

    if(userSnap.exists()){

        const data =
        userSnap.data();

        testsTaken.textContent =
        data.testsTaken || 0;

        bestWpm.textContent =
        data.bestWpm || 0;

        bestAccuracy.textContent =
        (data.bestAccuracy || 0)
        + "%";

    }

    const allUsers =

    await getDocs(
    collection(
    db,
    "users"
    )
    );

    let users = [];

    allUsers.forEach((doc)=>{

        users.push(
        doc.data()
        );

    });

    users.sort(function(a,b){

        return (b.bestWpm || 0)
        -
        (a.bestWpm || 0);

    });

    let rank =

    users.findIndex(
    u => u.email === user.email
    );

    document.getElementById(
    "userRank"
    ).textContent =
    "#" + (rank + 1);

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
