import { auth, db }
from "../firebase-config.js";

import {
doc,
updateDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const lessons = {

1:{
title:"Morning Story",
subtitle:"Simple sentence practice.",
target:"Today I woke up early in the morning and went for a walk in the garden. The weather was cool and pleasant. Birds were singing on the trees and children were playing happily in the park."
},

2:{
title:"Daily Routine",
subtitle:"Practice daily routine.",
target:"Every day I wake up at six o clock. I brush my teeth, take a bath, and eat breakfast. After that I go to work and complete my tasks carefully."
},

3:{
title:"School Day",
subtitle:"Simple story.",
target:"Rohan goes to school every morning. He studies English, Mathematics, and Science. He enjoys learning new things and always helps his friends in class."
},

4:{
title:"Family Time",
subtitle:"Practice long sentence.",
target:"My family likes to spend time together in the evening. We talk about our day, watch television, and enjoy dinner while sharing happy moments."
},

5:{
title:"Sunday Picnic",
subtitle:"Reading practice.",
target:"Last Sunday we visited a beautiful garden near our town. We carried food, played games, and clicked many photographs. Everyone enjoyed the picnic very much."
},

6:{
title:"Capital Letters",
subtitle:"Practice capitals.",
target:"My Name Is Rahul And I Live In Pune. Every Morning I Visit The Market And Buy Fresh Fruits For My Family."
},

7:{
title:"Travel Story",
subtitle:"Mixed typing.",
target:"Last Month We Traveled To Mumbai By Train. The Journey Was Comfortable And The View Outside The Window Was Amazing."
},

8:{
title:"Office Work",
subtitle:"Mixed capitals.",
target:"Today Our Team Completed An Important Project. Everyone Worked Hard And Finished The Tasks Before The Deadline."
},

9:{
title:"Book Reading",
subtitle:"Long practice.",
target:"Reading Books Improves Knowledge And Vocabulary. A Good Book Can Teach Valuable Lessons And Inspire New Ideas."
},

10:{
title:"Healthy Life",
subtitle:"Practice capitals.",
target:"Eating Healthy Food And Exercising Daily Helps Us Stay Strong And Active. Good Habits Improve Physical And Mental Health."
},

11:{
title:"Punctuation 1",
subtitle:"Comma practice.",
target:"I bought apples, bananas, oranges, grapes, and mangoes from the market. The fruits were fresh, tasty, and affordable."
},

12:{
title:"Punctuation 2",
subtitle:"Question marks.",
target:"How are you today? Did you complete your work? Are you ready for the next challenge? Practice regularly and improve your speed."
},

13:{
title:"Punctuation 3",
subtitle:"Exclamation marks.",
target:"What a beautiful day! The flowers are blooming! Everyone is excited! Keep practicing and achieve your goals!"
},

14:{
title:"Mixed Symbols",
subtitle:"Basic symbols.",
target:"The meeting starts at 10:00 AM. Please arrive on time. The report contains 25 pages and 3 important sections."
},

15:{
title:"Email Practice",
subtitle:"Email symbols.",
target:"Please send your feedback to support@example.com. Our team will reply within 24 hours and provide the required information."
},

16:{
title:"Advanced Mix 1",
subtitle:"Mixed content.",
target:"Hello, My Name Is Rahul. I Work In A Manufacturing Company. Every Day I Complete Tasks, Attend Meetings, And Support My Team."
},

17:{
title:"Advanced Mix 2",
subtitle:"Numbers and symbols.",
target:"Today I Completed 15 Tasks, Answered 20 Emails, And Attended 3 Meetings. My Performance Improved By 10% This Month."
},

18:{
title:"Advanced Mix 3",
subtitle:"Story practice.",
target:"On Saturday, We Visited A Museum. The Entry Fee Was Rs.100 Per Person. We Saw Historical Objects, Ancient Tools, And Beautiful Artwork."
},

19:{
title:"Advanced Mix 4",
subtitle:"Long challenge.",
target:"Learning Touch Typing Is An Excellent Skill. It Increases Speed, Improves Accuracy, And Saves Time. Regular Practice Makes Typing Easier And More Efficient."
},

20:{
title:"Final Challenge",
subtitle:"Complete test.",
target:"Good Morning! My Name Is Rahul And I Live In Pune. Every Day I Practice Touch Typing For 30 Minutes. Learning New Skills Improves Confidence, Increases Productivity, And Helps Achieve Career Goals. If You Practice Consistently, You Will Become Faster, More Accurate, And More Efficient At Typing."
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


/* =========================================
   TIMER + WPM
========================================= */

let startTime = null;

let timerStarted = false;

setInterval(function(){

    if(!timerStarted || lessonCompleted){

        return;

    }

    let seconds =
    Math.floor(
        (Date.now() - startTime) / 1000
    );

    let mins =
    Math.floor(seconds / 60);

    let secs =
    seconds % 60;

    document
    .getElementById("time")
    .innerText =
    String(mins).padStart(2,"0")
    + ":" +
    String(secs).padStart(2,"0");

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


if(
    lessonCompleted
){

    return;

}

    let value =
    input.value;

if(!timerStarted && value.length > 0){ timerStarted = true; startTime = Date.now(); }


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

/* =========================================
   PROGRESS BAR
========================================= */

let progressPercent =
Math.round(
(
value.length /
lesson.target.length
) * 100
);

document
.getElementById(
"progressFill"
)
.style.width =
progressPercent + "%";

document
.getElementById(
"progress"
)
.innerText =
progressPercent + "%";

/* =========================================
   WPM
========================================= */

if(timerStarted){

    let minutes =
    (
        Date.now() -
        startTime
    ) / 60000;

    if(minutes > 0){

        let wpm =
        Math.round(
            (
                value.length / 5
            ) / minutes
        );

        document
        .getElementById(
        "wpm"
        )
        .innerText =
        wpm;

    }

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
            "advancedCurrentLevel"
        ) || 1
    );

    if(
    accuracy >= 80
){

    if(level >= unlocked){

        localStorage.setItem(
            "advancedCurrentLevel",
            level + 1
        );       
    }
}

 const user = auth.currentUser;

if(user){

    await updateDoc(
    doc(
    db,
    "users",
    user.uid
    ),
    {
    "progress.bottomrow": level + 1
    }
    );

    console.log(
    "BOTTOM ROW PROGRESS UPDATED:",
    level + 1
    );

}      
    
let stars = "⭐⭐⭐";

if(mistakes >= 3){

    stars = "⭐";

}

else if(mistakes >= 1){

    stars = "⭐⭐";

}

document
.getElementById("starRating")
.innerText =
stars;


/* =========================================
   CIRCLE COLOR
========================================= */

if(accuracy >= 95){

    document
    .getElementById(
    "circleProgress"
    )
    .style.borderColor =
    "#22c55e";

}

else if(accuracy >= 80){

    document
    .getElementById(
    "circleProgress"
    )
    .style.borderColor =
    "#3b82f6";

}

else{

    document
    .getElementById(
    "circleProgress"
    )
    .style.borderColor =
    "#ef4444";

}



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
"advancedLevel" + level + "Stars",
stars
);

localStorage.setItem(
"advancedLevel" + level + "Score",
accuracy + "%"
);

if(
    accuracy === 100 &&
    mistakes === 0
){

    localStorage.setItem(
    "advancedLevel" + level + "Badge",
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
    "starRating"
    )
    .innerText =
    "❌";

document
.getElementById(
"starRating"
)
.classList.add(
"failed-rating"
);

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

    document
    .getElementById(
    "restartBtn"
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

    document
    .getElementById(
    "starRating"
    )
    .innerText =
    stars;

document
.getElementById(
"starRating"
)
.classList.remove(
"failed-rating"
);

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

}
else{

    document
    .getElementById(
    "performanceBadge"
    )
    .innerText =
    "✅ Excellent Work";

}

    document
    .getElementById(
    "nextBtn"
    )
    .style.display =
    "inline-block";

    document
    .getElementById(
    "restartBtn"
    )
    .style.display =
    "inline-block";

}

/* =========================================
   POPUP RESULT DATA
========================================= */

document
.getElementById(
"resultAccuracy"
)
.innerText =
accuracy + "%";

document
.getElementById(
"resultMistakes"
)
.innerText =
mistakes;

document
.getElementById(
"resultWpm"
)
.innerText =
document.getElementById(
"wpm"
).innerText;

document
.getElementById(
"resultTime"
)
.innerText =
document.getElementById(
"time"
).innerText;


/* =========================================
   PERFORMANCE GRADE
========================================= */

let grade = "Excellent 🏆";

if(accuracy < 95){

    grade = "Great 🥇";

}

if(accuracy < 90){

    grade = "Good 🥈";

}

if(accuracy < 80){

    grade = "Failed ❌";

}

lessonCompleted = true;

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
    "advanced.html";

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
    "advancedlevel.html?id=" +
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
