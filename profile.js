import {
auth,
db
}
from "./firebase-config.js";

import {
doc,
getDoc,
collection,
getDocs,
query,
where
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

const recentTests =
document.getElementById(
"recentTests"
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

if(home >= 21){

document.getElementById(
"badgeHome"
).classList.add(
"badge-earned"
);

}

if(bottom >= 21){

document.getElementById(
"badgeBottom"
).classList.add(
"badge-earned"
);

}

if(words >= 21){

document.getElementById(
"badgeWords"
).classList.add(
"badge-earned"
);

}

if(numbers >= 21){

document.getElementById(
"badgeNumbers"
).classList.add(
"badge-earned"
);

}

if(advanced >= 21){

document.getElementById(
"badgeAdvanced"
).classList.add(
"badge-earned"
);

}
        
document.getElementById(
"homeProgress"
).textContent =
(home - 1) + "/20";

document.getElementById(
"bottomProgress"
).textContent =
(bottom - 1) + "/20";

document.getElementById(
"wordsProgress"
).textContent =
(words - 1) + "/20";

document.getElementById(
"numbersProgress"
).textContent =
(numbers - 1) + "/20";

document.getElementById(
"advancedProgress"
).textContent =
(advanced - 1) + "/20";

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

if(overallProgress >= 100){

document.getElementById(
"badgeChampion"
).classList.add(
"badge-earned"
);

}
        
if(overallProgress >= 100){

document.getElementById(
"certificateBtn"
).style.display =
"block";

}
        
document.getElementById(
"progressText"
).textContent =
overallProgress +
"% Complete";

document.getElementById(
"progressFill"
).style.width =
overallProgress +
"%";
        
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

const historyQuery =

query(
collection(
db,
"history"
),
where(
"userId",
"==",
user.uid
)
);

const historySnap =

await getDocs(
historyQuery
);

let tests = [];

historySnap.forEach((doc)=>{

tests.push(
doc.data()
);

});

tests.sort(function(a,b){

return new Date(
b.date
)
-
new Date(
a.date
);

});

recentTests.innerHTML = "";

tests.slice(0,5)
.forEach(function(test,index){

recentTests.innerHTML +=
`
<div class="test-item">

<span>

Test #${tests.length - index}

</span>

<strong>

${test.wpm} WPM

</strong>

<span>

${test.accuracy}%

</span>

</div>
`;

});

if(tests.length === 0){

recentTests.innerHTML =

"No tests found";

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
