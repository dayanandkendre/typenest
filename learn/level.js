import { auth, db }
from "../firebase-config.js";

import {
doc,
updateDoc,
getDoc,
setDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const level =
parseInt(
new URLSearchParams(
window.location.search
).get("id")
|| 1
);

/* =========================================
   LESSON DATA (EVERY LEVEL HAS EXACTLY 32 CHARACTERS)
========================================= */

const lessons = {

1:{
title:"F J Introduction",
subtitle:"Learn the home keys F and J.",
target:["f","j","f","j"," ","f","j","f","j"," ","f","f","j","j"," ","j","j","f","f"," ","f","j","j","f"," ","j","f","f","j"," ","f","j"]
},

2:{
title:"Keys F & J",
subtitle:"Practice repeated F and J keys.",
target:["f","f","j","j"," ","f","f","j","j"," ","f","j","f","j"," ","j","f","j","f"," ","f","f","f","j"," ","j","j","j","f","j","f","j"]
},

3:{
title:"FJ Practice",
subtitle:"Build rhythm with FJ combinations.",
target:["f","j","j","f"," ","f","j","j","f"," ","j","f","f","j"," ","j","f","f","j"," ","f","f","j","j"," ","j","j","f","f"," ","f","j"]
},

4:{
title:"Space Bar",
subtitle:"Learn using the space key.",
target:["f"," ","j"," ","f"," ","j"," ","f","f"," ","j","j"," ","f","j"," ","j","f"," ","f"," ","j"," ","f","f"," ","j","j"," ","f","j"]
},

5:{
title:"Keys D & K",
subtitle:"Introduce D and K keys.",
target:["d","k","d","k"," ","d","k","d","k"," ","d","d","k","k"," ","k","k","d","d"," ","d","k","k","d"," ","k","d","d","k"," ","d","k"]
},

6:{
title:"Keys D & F",
subtitle:"Practice D and F keys.",
target:["d","f","d","f"," Bell","d","f","d","f"," ","d","d","f","f"," ","f","f","d","d"," ","d","f","f","d"," ","f","d","d","f"," ","d","f"]
},

7:{
title:"Keys J & K",
subtitle:"Practice J and K keys.",
target:["j","k","j","k"," ","j","k","j","k"," ","j","j","k","k"," ","k","k","j","j"," ","j","k","k","j"," ","k","j","j","k"," ","j","k"]
},

8:{
title:"DKF Practice",
subtitle:"Mixed practice.",
target:["d","k","f"," ","d","k","f"," ","f","k","d"," ","f","k","d"," ","d","f","k"," ","k","f","d"," ","d","d","k","k","f","f","d","k"]
},

9:{
title:"Keys S & L",
subtitle:"Practice S and L keys.",
target:["s","l","s","l"," ","s","l","s","l"," ","s","s","l","l"," ","l","l","s","s"," ","s","l","l","s"," ","l","s","s","l"," ","s","l"]
},

10:{
title:"Semicolon",
subtitle:"Practice semicolon key.",
target:[";",";",";",";"," ",";",";",";",";"," ",";",";",";",";"," ",";",";",";",";"," ",";",";",";",";"," ",";",";",";",";"," ",";",";"]
},

11:{
title:"All Home Keys",
subtitle:"Home row practice.",
target:["a","s","d","f"," ","j","k","l",";"," ","a","s","d","f"," ","j","k","l",";"," ","f","j","d","k"," ","s","l","a",";"," ","f","j"]
},

12:{
title:"Home Row Review",
subtitle:"Final review.",
target:["f","j","d","k"," ","s","l","a",";"," ","a","s","d","f"," ","j","k","l",";"," ",";","l","k","j"," ","f","d","s","a"," ","f","j"]
},

13:{
title:"Left Hand Practice",
subtitle:"Practice A S D F keys.",
target:["a","s","d","f"," ","a","s","d","f"," ","f","d","s","a"," ","f","d","s","a"," ","a","a","s","s"," ","d","d","f","f"," ","a","f"]
},

14:{
title:"Right Hand Practice",
subtitle:"Practice J K L ; keys.",
target:["j","k","l",";"," ","j","k","l",";"," ",";","l","k","j"," ",";","l","k","j"," ","j","j","k","k"," ","l","l",";",";"," ","j",";"]
},

15:{
title:"Left Hand Drill",
subtitle:"Build speed with left hand.",
target:["a","s","f","d"," ","a","f","s","d"," ","d","s","f","a"," ","f","s","a","d"," ","a","s","d","f"," ","f","d","s","a"," ","a","s"]
},

16:{
title:"Right Hand Drill",
subtitle:"Build speed with right hand.",
target:["j","k",";","l"," ","j",";","k","l"," ",";","l","k","j"," ","l","k",";","j"," ","j","k","l",";"," ",";","l","k","j"," ","j","k"]
},

17:{
title:"Home Row Mix 1",
subtitle:"Mix both hands together.",
target:["a","j","s","k"," ","d","l","f",";"," ","j","a","k","s"," ","l","d",";","f"," ","a","s","d","f"," ","j","k","l",";"," ","a","j"]
},

18:{
title:"Home Row Mix 2",
subtitle:"Advanced home row combinations.",
target:["f","j","d","k"," ","s","l","a",";"," ",";","a","l","s"," ","k","d","j","f"," ","a","j","s","k"," ","d","l","f",";"," ","f","j"]
},

19:{
title:"Home Row Words",
subtitle:"Type real home row words.",
target:["s","a","d"," ","a","s","k"," ","l","a","d"," ","f","a","d"," ","a","d","d"," ","a","l","l"," ","f","a","l","l"," ","s","a","d"]
},

20:{
title:"Final Test",
subtitle:"Complete home row challenge.",
target:["a","s","d","f"," ","j","k","l",";"," ","s","a","l","a","d"," ","f","l","a","s","h"," ","g","l","a","s","s"," ","d","a","d"," "]
}

};

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
"homeLevel" + level + "Stars"
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


let elapsedMinutes =
(
    Date.now() -
    startTime
) / 60000;

if(
    elapsedMinutes > 0
){

    let wordsTyped =
    current / 5;

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

/* =========================================
       SCROLL CODE (इथे पेस्ट केला आहे)
    ========================================= */
    const activeLetter = document.getElementById("l" + current);
    const lettersContainer = document.querySelector(".letters-row");
    
    if (activeLetter && lettersContainer) {
        const containerWidth = lettersContainer.offsetWidth;
        const letterLeft = activeLetter.offsetLeft;
        const letterWidth = activeLetter.offsetWidth;
        lettersContainer.scrollLeft = letterLeft - (containerWidth / 2) + (letterWidth / 2);
    }
   
    /* =========================================
       LEVEL COMPLETE
    ========================================= */

  if(current === target.length){

let unlocked =
parseInt(
    localStorage.getItem(
        "currentLevel"
    ) || 1
);

if(level >= unlocked){

    localStorage.setItem(
        "currentLevel",
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
userSnap.data()?.progress?.home || 1;

const newProgress =
Math.max(
oldProgress,
level + 1
);

await updateDoc(
userRef,
{
"progress.home": newProgress
}
);

    console.log(
    "HOME PROGRESS UPDATED:",
    level + 1
    );

}
      
if(level === 20){

    localStorage.setItem(
    "sectionUnlocked",
    2
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
"homeLevel" + level + "Stars",
stars
);

localStorage.setItem(
"homeLevel" + level + "Score",
accuracy + "%"
);

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
    "learn.html";

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
    "level.html?id=" +
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
