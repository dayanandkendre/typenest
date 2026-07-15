import { auth, db }
from "../firebase-config.js";

import {
doc,
getDoc,
updateDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================================
   LESSON DATA (BOTTOM ROW - EXACTLY 32 CHARACTERS)
========================================= */

const lessons = {

1:{
title:"V N Introduction",
subtitle:"Learn the bottom row keys V and N.",
target:["v","n","v","n"," ","v","n","v","n"," ","v","v","n","n"," ","n","n","v","v"," ","v","n","n","v"," ","n","v","v","n"," ","v","n"]
},

2:{
title:"Keys V & N",
subtitle:"Practice repeated V and N keys.",
target:["v","v","n","n"," ","v","v","n","n"," ","v","n","v","n"," ","n","v","v","n"," ","v","v","v","n"," ","n","n","n","v"," ","v","n"]
},

3:{
title:"VN Practice",
subtitle:"Build rhythm with VN combinations.",
target:["v","n","n","v"," ","v","n","n","v"," ","n","v","v","n"," ","n","v","v","n"," ","v","v","n","n"," ","n","n","v","v"," ","v","n"]
},

4:{
title:"Keys C & M",
subtitle:"Learn C and M keys.",
target:["c","m","c","m"," ","c","m","c","m"," ","c","c","m","m"," ","m","m","c","c"," ","c","m","m","c"," ","m","c","c","m"," ","c","m"]
},

5:{
title:"CM Practice",
subtitle:"Practice C and M combinations.",
target:["c","c","m","m"," ","c","c","m","m"," ","c","m","c","m"," ","m","c","m","c"," ","c","c","c","m"," ","m","m","m","c"," ","c","m"]
},

6:{
title:"VCNM Mix",
subtitle:"Mix V C N M keys.",
target:["v","c","n","m"," ","v","c","n","m"," ","c","m","v","n"," ","m","c","n","v"," ","v","v","c","c"," ","n","n","m","m"," ","v","n"]
},

7:{
title:"Keys X & B",
subtitle:"Learn X and B keys.",
target:["x","b","x","b"," ","x","b","x","b"," ","x","x","b","b"," ","b","b","x","x"," ","x","b","b","x"," ","b","x","x","b"," ","x","b"]
},

8:{
title:"XB Practice",
subtitle:"Practice X and B combinations.",
target:["x","x","b","b"," ","x","x","b","b"," ","x","b","x","b"," ","b","x","b","x"," ","x","x","x","b"," ","b","b","b","x"," ","x","b"]
},

9:{
title:"Bottom Mix",
subtitle:"Mix X B C V keys.",
target:["x","b","c","v"," Bell","x","b","c","v"," ","b","c","v","x"," ","v","c","b","x"," ","x","x","b","b"," ","c","c","v","v"," ","x","c"]
},

10:{
title:"Keys Z & ,",
subtitle:"Learn Z and Comma keys.",
target:["z",",","z",","," ","z",",","z",","," ","z","z",",",","," ",",",",","z","z"," ","z",",",",","z"," ",",","z","z",","," ","z",","]
},

11:{
title:"Z Comma Practice",
subtitle:"Practice Z and Comma.",
target:["z","z",",",","," ","z","z",",",","," ","z",",","z",","," ",",","z",",","z"," ","z","z","z",","," ",",",",",",","z"," ","z",","]
},

12:{
title:"Bottom Row Review",
subtitle:"Review all bottom row keys.",
target:["z","x","c","v"," ","b","n","m",","," ","z","x","c","v"," ","b","n","m",","," ",",","m","n","b"," ","v","c","x","z"," ","z",","]
},

13:{
title:"Left Hand Practice",
subtitle:"Practice Z X C V keys.",
target:["z","x","c","v"," ","z","x","c","v"," ","v","c","x","z"," ","v","c","x","z"," ","z","z","x","x"," ","c","c","v","v"," ","z","v"]
},

14:{
title:"Right Hand Practice",
subtitle:"Practice B N M , keys.",
target:["b","n","m",","," ","b","n","m",","," ",",","m","n","b"," ",",","m","n","b"," ","b","b","n","n"," ","m","m",",",","," ","b",","]
},

15:{
title:"Left Drill",
subtitle:"Build speed with ZXCV.",
target:["z","c","x","v"," ","z","v","x","c"," ","c","x","v","z"," ","v","x","c","z"," ","z","x","c","v"," ","v","c","x","z"," ","z","c"]
},

16:{
title:"Right Drill",
subtitle:"Build speed with BNM,",
target:["b","m","n",","," ","b",",","n","m"," ","m","n",",","b"," ",",","n","m","b"," ","b","n","m",","," ",",","m","n","b"," ","b","m"]
},

17:{
title:"Bottom Row Mix",
subtitle:"Mixed bottom row practice.",
target:["z","b","x","n"," ","c","m","v",","," ","b","z","n","x"," ","m","c",",","v"," ","z","x","c","v"," ","b","n","m",","," ","z","b"]
},

18:{
title:"Advanced Mix",
subtitle:"Advanced bottom row combinations.",
target:["v","n","c","m"," ","x","b","z",","," ",",","z","b","x"," ","m","c","n","v"," ","z","b","x","n"," ","c","m","v",","," ","v","c"]
},

19:{
title:"Bottom Row Words",
subtitle:"Bottom row word practice.",
target:["z","o","n","e"," ","m","o","v","e"," ","c","o","m","b"," ","m","e","n","u"," ","b","o","n","d"," ","c","o","i","n"," ","m","v"]
},

20:{
title:"Final Test",
subtitle:"Complete the bottom row challenge.",
target:["v","o","i","c","e"," ","c","o","n","v","e","x"," ","z","e","b","r","a"," ","m","a","x","i","m","u","m"," ","z","e","r","o"," "]
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

const target =
lesson.target;

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

let savedStars =
localStorage.getItem(
"level" + level + "Stars"
);

if(savedStars){

    document
    .getElementById("topStars")
    .innerText =
    savedStars;

}
/* =========================================
   DYNAMIC LETTER BOXES
========================================= */

let lettersHTML = "";

for(let i=0;i<target.length;i++){

    lettersHTML +=
    `<div class="letter ${
        i===0 ? "active" : ""
    }" id="l${i}">
        ${target[i] === " " ? "␣" : target[i]}
    </div>`;

}

document
.getElementById("lettersRow")
.innerHTML =
lettersHTML;

const input =
document.getElementById("typingInput");

const keySound =
document.getElementById(
"keySound"
);

let current = 0;
let mistakes = 0;

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


/* =========================================
   TYPING LOGIC
========================================= */

input.addEventListener("input", async function(){
if(!timerStarted){

    startTime =
    Date.now();

    timerStarted =
    true;

}

    mistakes = 0;

    const value =
      input.value;
     console.log(
"Value:",
JSON.stringify(value),
"Length:",
value.length
);

    current = value.length;

    for(let i=0;i<target.length;i++){

        document
        .getElementById("l"+i)
        .classList.remove(
            "active",
            "correct",
            "wrong"
        );

    }

    for(let i=0;i<value.length;i++){

        if(value[i] === target[i]){

            document
            .getElementById("l"+i)
            .classList.add("correct");

        }

        else{

            document
            .getElementById("l"+i)
            .classList.add("wrong");

            mistakes++;

        }

    }

    if(current < target.length){

        document
        .getElementById("l"+current)
        .classList.add("active");

    }

    document
.getElementById("progress")
.innerText =
current + " / " + target.length;

    document
    .getElementById("mistakes")
    .innerText =
    mistakes;

    let accuracy = 100;

    if(current > 0){

        accuracy =
        Math.round(
            (
                (current - mistakes)
                / current
            ) * 100
        );

    }

    document
    .getElementById("accuracy")
    .innerText =
    accuracy + "%";

let elapsedMinutes = (Date.now() - startTime) / 60000;

if (elapsedMinutes > 0) {
    // एकूण टाईप केलेल्या अक्षरांमधून चुका वजा करणे (Net Speed)
    let correctCharacters = current - mistakes;
    if (correctCharacters < 0) correctCharacters = 0;

    let wordsTyped = correctCharacters / 5;
    let wpm = Math.round(wordsTyped / elapsedMinutes);

    document.getElementById("wpm").innerText = wpm;
}
   /* =========================================
       AUTOMATIC SCROLLING LOGIC
    ========================================= */
    const activeLetter = document.getElementById("l" + current);
    const lettersContainer = document.querySelector(".letters-row");
    
    if (activeLetter && lettersContainer) {
        const containerWidth = lettersContainer.offsetWidth;
        const letterLeft = activeLetter.offsetLeft;
        const letterWidth = activeLetter.offsetWidth;
        
        // ॲक्टिव्ह लेटर नेहमी मध्यभागी ठेवण्यासाठी स्क्रोल कॅल्क्युलेशन
        lettersContainer.scrollLeft = letterLeft - (containerWidth / 2) + (letterWidth / 2);
    }

    /* =========================================
       LEVEL COMPLETE
    ========================================= */

    if(current === target.length){

let unlocked =
parseInt(
    localStorage.getItem(
        "bottomRowCurrentLevel"
    ) || 1
);

if(level >= unlocked){

    localStorage.setItem(
        "bottomRowCurrentLevel",
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
userSnap.data()?.progress?.bottomrow || 1;

const newProgress =
Math.max(
oldProgress,
level + 1
);

await updateDoc(
userRef,
{
"progress.bottomrow": newProgress
}
);

    console.log(
    "BOTTOM ROW PROGRESS UPDATED:",
    level + 1
    );

}

if(level === 20){

localStorage.setItem(
"sectionUnlocked",
"4"
);

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

/* FAIL */

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
    "starRating"
    )
    .innerText =
    "❌";

    document
    .getElementById(
    "performanceBadge"
    )
    .innerText =
    "❌ Practice Again";

    document
    .getElementById(
    "nextBtn"
    )
    .style.display =
    "none";

}

/* SUCCESS */

else{

    document
    .getElementById(
    "popupTitle"
    )
    .innerText =
    "🎉 Level Complete";

    document
    .getElementById(
    "starRating"
    )
    .innerText =
    stars;

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

    document
    .getElementById(
    "nextBtn"
    )
    .style.display =
    "inline-block";

}

localStorage.setItem(
"bottomLevel" + level + "Stars",
stars
);

localStorage.setItem(
"bottomLevel" + level + "Score",
accuracy + "%"
);

if(
accuracy === 100 &&
mistakes === 0
){

localStorage.setItem(
"bottomLevel" + level + "Badge",
"🏆 Perfect"
);

}
       
let streak =
parseInt(
localStorage.getItem(
"bestStreak"
) || 0
);

if(level > streak){

    localStorage.setItem(
        "bestStreak",
        level
    );

}

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
.getElementById(
"popup"
)
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
    "bottomrow.html";

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
"bottomrowlevel.html?id=" +
(level + 1);

});

/* =========================================
   CAPS LOCK WARNING
========================================= */

document.addEventListener(
"keydown",
function(event){

   if(keySound){

    keySound.currentTime = 0;

    keySound.play().catch(()=>{});

}

    if(event.getModifierState("CapsLock")){

        document
        .getElementById("capsWarning")
        .style.display =
        "block";

    }

    else{

        document
        .getElementById("capsWarning")
        .style.display =
        "none";

    }

});
