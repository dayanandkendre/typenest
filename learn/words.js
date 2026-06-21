import { auth, db }
from "../firebase-config.js";

import {
doc,
getDoc,
updateDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const lessons = {

1:{
title:"AS Practice",
subtitle:"Practice AS and SA.",
target:"as sa as sa as sa"
},

2:{
title:"SAD Practice",
subtitle:"Practice SAD and DAD.",
target:"sad dad sad dad sad dad sad dad sad dad sad dad"
},

3:{
title:"DAD Practice",
subtitle:"Practice DAD and SAD.",
target:"dad sad dad sad dad sad"
},

4:{
title:"FALL Practice",
subtitle:"Practice FALL.",
target:"fall fall fall fall fall fall"
},

5:{
title:"ASK Practice",
subtitle:"Practice ASK.",
target:"ask ask ask ask ask ask"
},

6:{
title:"RED Practice",
subtitle:"Practice RED.",
target:"red red red red red red"
},

7:{
title:"ROW Practice",
subtitle:"Practice ROW.",
target:"row row row row row row"
},

8:{
title:"OUR Practice",
subtitle:"Practice OUR.",
target:"our our our our our our"
},

9:{
title:"WERE Practice",
subtitle:"Practice WERE.",
target:"were were were were were were"
},

10:{
title:"POWER Practice",
subtitle:"Practice POWER.",
target:"power power power power"
},

11:{
title:"CAN Practice",
subtitle:"Practice CAN.",
target:"can can can can can can"
},

12:{
title:"MAN Practice",
subtitle:"Practice MAN.",
target:"man man man man man man"
},

13:{
title:"BOX Practice",
subtitle:"Practice BOX.",
target:"box box box box box box"
},

14:{
title:"ZOOM Practice",
subtitle:"Practice ZOOM.",
target:"zoom zoom zoom zoom"
},

15:{
title:"MIX Practice",
subtitle:"Practice MIX.",
target:"mix mix mix mix mix mix"
},

16:{
title:"Word Mix 1",
subtitle:"Mixed words.",
target:"as sad dad ask red row"
},

17:{
title:"Word Mix 2",
subtitle:"Mixed words.",
target:"our were power can man box"
},

18:{
title:"Speed Practice",
subtitle:"Speed words.",
target:"red row our were power zoom"
},

19:{
title:"Advanced Practice",
subtitle:"Advanced words.",
target:"mix zoom power were row box"
},

20:{
title:"Final Test",
subtitle:"Final challenge.",
target:"as sad dad ask red row our were power can"
}

};

let level =
parseInt(
new URLSearchParams(
window.location.search
).get("id")
|| 1
);

const lesson =
lessons[level];

document
.getElementById("lessonTitle")
.innerText =
lesson.title;

document
.getElementById("lessonSubtitle")
.innerText =
lesson.subtitle;

document
.getElementById("levelNumber")
.innerText =
"Level " + level;

function renderText(value = ""){

let currentWord =
0;

let wordStart =
0;

for(
    let i = 0;
    i < value.length;
    i++
){

    if(
        lesson.target[i]
        === " "
    ){

        currentWord++;

        wordStart =
        i + 1;

    }

}

    let html = "";

    for(let i = 0; i < lesson.target.length; i++){

        let cls = "pending-char";

let tempWord =
0;

for(
    let j = 0;
    j < i;
    j++
){

    if(
        lesson.target[j]
        === " "
    ){

        tempWord++;

    }

}

if(
    tempWord ===
    currentWord
){

    cls +=
    " active-word";

}

if(i === value.length){

    cls += " current-char";

}

        if(i < value.length){

            if(value[i] === lesson.target[i]){

                cls = "correct-char";

            }

            else{

                cls = "wrong-char";

            }

        }

        let ch = lesson.target[i];

if(ch === " "){

    ch = "&nbsp;&nbsp;&nbsp;";

}

html += `<span class="${cls}">${ch}</span>`;

    }

    document
    .getElementById("textDisplay")
    .innerHTML =
    html;


document
.querySelectorAll(".key")
.forEach(key => {

    key.classList.remove(
    "active-key"
    );

});


let nextChar =
lesson.target[value.length];

if(nextChar){

    let keyId = null;

    if(nextChar === " "){

    keyId = "spaceKey";

}

else if(nextChar === "-"){

    keyId = "keyMinus";

}

else if(nextChar === "="){

    keyId = "keyEqual";

}

else if(/[0-9]/.test(nextChar)){

    keyId =
    "key" +
    nextChar;

}

else{

    keyId =
    "key" +
    nextChar.toUpperCase();

}

    let key =
    document.getElementById(
    keyId
    );

    if(key){

        key.classList.add(
        "active-key"
        );

    }

}


const currentChar =
document.querySelector(
".current-char"
);

if(currentChar){

    const container =
    document.querySelector(
    ".text-display"
    );

    const center =
    container.offsetWidth / 2;

    const x =
    currentChar.offsetLeft;

    document
    .getElementById(
    "textDisplay"
    )
    .style.transform =
    `translateX(${center - x}px)`;

}

}

renderText();



const input =
document.getElementById("typingInput");

const keySound =
document.getElementById(
"keySound"
);

let lessonCompleted = false;


let startTime = null;
let timerStarted = false;

setInterval(function(){

    if(!timerStarted){

        return;

    }

    let seconds =
    Math.floor(
        (
            Date.now() -
            startTime
        ) / 1000
    );

    let mins =
    Math.floor(
        seconds / 60
    );

    let secs =
    seconds % 60;

    document
    .getElementById(
    "time"
    )
    .innerText =
    String(mins)
    .padStart(2,"0")
    + ":" +
    String(secs)
    .padStart(2,"0");

},1000);


window.onload = function(){

    input.focus();

};

document.addEventListener(
"click",
function(){

    input.focus();

});

input.addEventListener("input", async function(){

if(!timerStarted){

    startTime =
    Date.now();

    timerStarted =
    true;

}


if(
    lessonCompleted
){

    return;

}

    let value =
    input.value;

    let mistakes = 0;

    for(
        let i = 0;
        i < value.length;
        i++
    ){

        if(
            value[i] !==
            lesson.target[i]
        ){

            mistakes++;

        }

    }

    let accuracy = 100;

    if(value.length > 0){

        accuracy =
        Math.round(
            (
                (value.length - mistakes)
                / value.length
            ) * 100
        );

    }

    renderText(value);

    document
    .getElementById("progress")
    .innerText =
    value.length +
    " / " +
    lesson.target.length;

    document
    .getElementById("mistakes")
    .innerText =
    mistakes;

    document
    .getElementById("accuracy")
    .innerText =
    accuracy + "%";

let elapsedMinutes =
(
    Date.now() -
    startTime
) / 60000;

if(
    elapsedMinutes > 0
){

    let wordsTyped =
    value.length / 5;

    let wpm =
    Math.round(
        wordsTyped /
        elapsedMinutes
    );

    document
    .getElementById(
    "wpm"
    )
    .innerText =
    wpm;

}

if(
    value.length ===
    lesson.target.length
){

    console.log(
        "LEVEL COMPLETE"
    );

    let unlocked =
    parseInt(
        localStorage.getItem(
            "wordsCurrentLevel"
        ) || 1
    );

    if(
    accuracy >= 80
){

    if(level >= unlocked){

        localStorage.setItem(
            "wordsCurrentLevel",
            level + 1
        ); 
    }
 const user = auth.currentUser;

if(user){

   const userRef =
doc(db,"users",user.uid);

const userSnap =
await getDoc(userRef);

const oldProgress =
userSnap.data()?.progress?.words || 1;

const newProgress =
Math.max(
oldProgress,
level + 1
);

await updateDoc(
userRef,
{
"progress.words": newProgress
}
);

    console.log(
    "WORDS PROGRESS UPDATED:",
    level + 1
    );

}
    
if(level === 20){

    localStorage.setItem(
    "sectionUnlocked",
    "5"
    );
}
}    
let stars = "⭐⭐⭐";

if(mistakes >= 3){

    stars = "⭐";

}

else if(mistakes >= 1){

    stars = "⭐⭐";

}

/* RESULT DATA */

document
.getElementById(
"resultAccuracy"
)
.innerText =
document
.getElementById(
"accuracy"
)
.innerText;

document
.getElementById(
"resultMistakes"
)
.innerText =
document
.getElementById(
"mistakes"
)
.innerText;

document
.getElementById(
"resultWpm"
)
.innerText =
document
.getElementById(
"wpm"
)
.innerText;

document
.getElementById(
"resultTime"
)
.innerText =
document
.getElementById(
"time"
)
.innerText;

document
.getElementById("starRating")
.innerText =
stars;

if(
    accuracy < 80
){

    document
    .getElementById(
    "starRating"
    )
    .innerText =
    "❌ FAILED";

}

localStorage.setItem(
"wordsLevel" + level + "Stars",
stars
);

localStorage.setItem(
"wordsLevel" + level + "Score",
accuracy + "%"
);

if(
    accuracy === 100 &&
    mistakes === 0
){

    localStorage.setItem(
    "wordsLevel" + level + "Badge",
    "🏆 Perfect"
    );

}


if(
    accuracy < 80
){

    document
    .getElementById(
    "popupTitle"
    )
    .innerText =
    "❌ Level Failed";

    document
    .getElementById(
    "nextBtn"
    )
    .style.display =
    "none";

    document
    .getElementById(
    "retryBtn"
    )
    .style.display =
    "inline-block";

}

else{

    document
    .getElementById(
    "popupTitle"
    )
    .innerText =
    "🎉 Level Complete";

}

lessonCompleted = true;

timerStarted = false;

const userUID =
localStorage.getItem("userUID");

if(userUID){

const userRef =
doc(
db,
"users",
userUID
);

const userSnap =
await getDoc(userRef);

if(userSnap.exists()){

const data =
userSnap.data();

let currentWpm =
parseInt(
document
.getElementById("wpm")
.innerText
) || 0;

await updateDoc(
userRef,
{

testsTaken:
(data.testsTaken || 0) + 1,

bestWpm:
Math.max(
data.bestWpm || 0,
currentWpm
),

bestAccuracy:
Math.max(
data.bestAccuracy || 0,
accuracy
),

"stats.totalStars":
(data.stats?.totalStars || 0)
+
(stars === "⭐⭐⭐" ? 3 :
stars === "⭐⭐" ? 2 : 1),

"stats.perfectRuns":
(data.stats?.perfectRuns || 0)
+
(
accuracy === 100 &&
mistakes === 0
? 1 : 0
),

"stats.bestStreak":
Math.max(
data.stats?.bestStreak || 0,
level
),

"stats.totalScore":
(data.stats?.totalScore || 0)
+
accuracy

}
);

}

}
    
document
.getElementById("popup")
.style.display =
"flex";

}

});


/* =========================================
   RESTART BUTTON
========================================= */

document
.getElementById("restartBtn")
.addEventListener(
"click",
function(){

    location.reload();

});

/* =========================================
   BACK BUTTON
========================================= */

document
.getElementById("backBtn")
.addEventListener(
"click",
function(){

    window.location.href =
    "words.html";

});

/* =========================================
   NEXT LEVEL BUTTON
========================================= */

document
.getElementById("nextBtn")
.addEventListener(
"click",
function(){

    window.location.href =
    "wordslevel.html?id=" +
    (level + 1);

});

/* =========================================
   KEYBOARD ANIMATION
========================================= */

document.addEventListener(
"keydown",
function(e){

if(keySound){

    keySound.currentTime = 0;

    keySound.play().catch(()=>{});

}
    
if(
    lessonCompleted
){

    return;

}

    let keyId = null;

    if(e.code === "Space"){

        keyId = "spaceKey";

    }

    else if(e.code === "Backspace"){

        keyId = "keyBackspace";

    }

    else if(e.code === "Enter"){

        keyId = "keyEnter";

    }

    else if(e.code === "Tab"){

        keyId = "keyTab";

    }

    else if(e.code === "CapsLock"){

        keyId = "keyCaps";

    }

    else if(e.code === "ShiftLeft"){

        keyId = "keyShiftLeft";

    }

    else if(e.code === "ShiftRight"){

        keyId = "keyShiftRight";

    }

    else if(
        /^[a-zA-Z0-9]$/
        .test(e.key)
    ){

        keyId =
        "key" +
        e.key.toUpperCase();

    }

    let key =
    document.getElementById(
        keyId
    );

    if(key){

        key.classList.add(
            "space-active"
        );

        key.classList.add(
            "key-pressed"
        );

    }

});

document.addEventListener(
"keyup",
function(e){

if(
    lessonCompleted
){

    return;

}


    let keyId = null;

    if(e.code === "Space"){

        keyId = "spaceKey";

    }

    else if(e.code === "Backspace"){

        keyId = "keyBackspace";

    }

    else if(e.code === "Enter"){

        keyId = "keyEnter";

    }

    else if(e.code === "Tab"){

        keyId = "keyTab";

    }

    else if(e.code === "CapsLock"){

        keyId = "keyCaps";

    }

    else if(e.code === "ShiftLeft"){

        keyId = "keyShiftLeft";

    }

    else if(e.code === "ShiftRight"){

        keyId = "keyShiftRight";

    }

    else if(
        /^[a-zA-Z0-9]$/
        .test(e.key)
    ){

        keyId =
        "key" +
        e.key.toUpperCase();

    }

    let key =
    document.getElementById(
        keyId
    );

    if(key){

        key.classList.remove(
            "space-active"
        );

        key.classList.remove(
            "key-pressed"
        );

    }

});

document
.getElementById("retryBtn")
.addEventListener(
"click",
function(){

    location.reload();

});
