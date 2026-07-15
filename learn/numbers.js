import { auth, db }
from "../firebase-config.js";

import {
doc,
getDoc,
updateDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* =========================================
   LESSON DATA (NUMBERS ROW - ENHANCED & EXTENDED)
========================================= */
const lessons = {

1:{
title:"1 and 9",
subtitle:"Index fingers practice.",
target:"19 91 19 91 19 91 19 91 19 91 19 91 19 91 19 91 19 91"
},

2:{
title:"2 and 0",
subtitle:"Middle fingers practice.",
target:"20 02 20 02 20 02 20 02 20 02 20 02 20 02 20 02 20 02"
},

3:{
title:"1 9 2 0",
subtitle:"Mixed numbers.",
target:"1920 2019 1920 2019 1920 2019 1920 2019 1920 2019"
},

4:{
title:"3 and 8",
subtitle:"Ring fingers practice.",
target:"38 83 38 83 38 83 38 83 38 83 38 83 38 83 38 83 38 83"
},

5:{
title:"4 and 7",
subtitle:"Little fingers practice.",
target:"47 74 47 74 47 74 47 74 47 74 47 74 47 74 47 74 47 74"
},

6:{
title:"1 2 3 4",
subtitle:"Left hand numbers.",
target:"1234 4321 1234 4321 1234 4321 1234 4321 1234 4321"
},

7:{
title:"9 0 8 7",
subtitle:"Right hand numbers.",
target:"9087 7809 9087 7809 9087 7809 9087 7809 9087 7809"
},

8:{
title:"Mixed Numbers",
subtitle:"Both hands practice.",
target:"1920 3847 9201 7483 1920 3847 9201 7483 1920 3847"
},

9:{
title:"Number Flow",
subtitle:"Smooth typing.",
target:"1234 9870 1234 9870 1234 9870 1234 9870 1234 9870"
},

10:{
title:"Number Test",
subtitle:"Mixed test.",
target:"19203847 92017483 19203847 92017483 19203847 92017483"
},

11:{
title:"A1 B2",
subtitle:"Letters and numbers.",
target:"A1 B2 A1 B2 A1 B2 A1 B2 A1 B2 A1 B2 A1 B2 A1 B2 A1 B2"
},

12:{
title:"C3 D4",
subtitle:"Letters and numbers.",
target:"C3 D4 C3 D4 C3 D4 C3 D4 C3 D4 C3 D4 C3 D4 C3 D4 C3 D4"
},

13:{
title:"E5 F6",
subtitle:"Letters and numbers.",
target:"E5 F6 E5 F6 E5 F6 E5 F6 E5 F6 E5 F6 E5 F6 E5 F6 E5 F6"
},

14:{
title:"P71",
subtitle:"Drawing number.",
target:"P71 P71 P71 P71 P71 P71 P71 P71 P71 P71 P71 P71 P71 P71"
},

15:{
title:"MS9",
subtitle:"Industrial code.",
target:"MS9 MS9 MS9 MS9 MS9 MS9 MS9 MS9 MS9 MS9 MS9 MS9 MS9 MS9"
},

16:{
title:"P71-9MS",
subtitle:"Drawing code.",
target:"P71-9MS P71-9MS P71-9MS P71-9MS P71-9MS P71-9MS P71-9MS"
},

17:{
title:"051361",
subtitle:"Material number.",
target:"051361 051361 051361 051361 051361 051361 051361 051361"
},

18:{
title:"P71-9MS-051361",
subtitle:"Industrial typing.",
target:"P71-9MS-051361 P71-9MS-051361 P71-9MS-051361 P71-9MS"
},

19:{
title:"Production Code",
subtitle:"Advanced code typing.",
target:"P71 051361 MS9 P71 P71 051361 MS9 P71 P71 051361 MS9"
},

20:{
title:"Final Test",
subtitle:"Complete challenge.",
target:"P71-9MS-051361 P71 MS9 051361 P71-9MS-051361 P71 MS9"
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

let currentWord = 0;
let wordStart = 0;

for(let i = 0; i < value.length; i++){
    if(lesson.target[i] === " "){
        currentWord++;
        wordStart = i + 1;
    }
}

let html = "";

for(let i = 0; i < lesson.target.length; i++){
    let cls = "pending-char";
    let tempWord = 0;

    for(let j = 0; j < i; j++){
        if(lesson.target[j] === " "){
            tempWord++;
        }
    }

    if(tempWord === currentWord){
        cls += " active-word";
    }

    if(i === value.length){
        cls += " current-char";
    }

    if(i < value.length){
        if(value[i] === lesson.target[i]){
            cls = "correct-char";
        } else {
            cls = "wrong-char";
        }
    }

    let ch = lesson.target[i];
    if(ch === " "){
        ch = "&nbsp;&nbsp;&nbsp;";
    }

    html += `<span class="${cls}">${ch}</span>`;
}

document.getElementById("textDisplay").innerHTML = html;

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

    if(
        !timerStarted ||
        lessonCompleted
    ){

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
            "numbersCurrentLevel"
        ) || 1
    );

    if(
    accuracy >= 80
){

    if(level >= unlocked){

        localStorage.setItem(
            "numbersCurrentLevel",
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
userSnap.data()?.progress?.numbers || 1;

const newProgress =
Math.max(
oldProgress,
level + 1
);

await updateDoc(
userRef,
{
"progress.numbers": newProgress
}
);

    console.log(
    "NUMBERS ROW PROGRESS UPDATED:",
    level + 1
    );

}
        
        if(level === 20){

    localStorage.setItem(
    "sectionUnlocked",
    "6"
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
"numbersLevel" + level + "Stars",
stars
);

localStorage.setItem(
"numbersLevel" + level + "Score",
accuracy + "%"
);

if(
    accuracy === 100 &&
    mistakes === 0
){

    localStorage.setItem(
    "numbersLevel" + level + "Badge",
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

document
.getElementById(
"performanceBadge"
)
.innerText =
"❌ Practice Again";

}

else{

document
.getElementById(
"popupTitle"
)
.innerText =
"🎉 Level Complete";

if(
    accuracy === 100 &&
    mistakes === 0
){

    document
    .getElementById(
    "performanceBadge"
    )
    .innerText =
    "🏆 PERFECT RUN";

    document
    .getElementById(
    "performanceBadge"
    )
    .classList.add(
    "perfect-badge"
    );

}
else{

    document
    .getElementById(
    "performanceBadge"
    )
    .innerText =
    "✅ Excellent Work";

    document
    .getElementById(
    "performanceBadge"
    )
    .classList.remove(
    "perfect-badge"
    );

}

lessonCompleted = true;

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
    "numbers.html";

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
    "numberslevel.html?id=" +
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
