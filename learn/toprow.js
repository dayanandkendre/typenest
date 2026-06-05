/* =========================================
   LESSON DATA
========================================= */

const lessons = {

1:{
title:"R U Introduction",
subtitle:"Learn the top row keys R and U.",
target:["r","u","r","u","r","u","r","u"]
},

2:{
title:"Keys R & U",
subtitle:"Practice repeated R and U keys.",
target:["r","r","u","u","r","r","u","u"]
},

3:{
title:"RU Practice",
subtitle:"Build rhythm with RU combinations.",
target:["r","u","u","r","r","u","u","r"]
},

4:{
title:"Keys E & I",
subtitle:"Learn E and I keys.",
target:["e","i","e","i","e","i","e","i"]
},

5:{
title:"EI Practice",
subtitle:"Practice E and I combinations.",
target:["e","e","i","i","e","e","i","i"]
},

6:{
title:"REUI Mix",
subtitle:"Mix R E U I keys.",
target:["r","e","u","i","r","e","u","i"]
},

7:{
title:"Keys W & O",
subtitle:"Learn W and O keys.",
target:["w","o","w","o","w","o","w","o"]
},

8:{
title:"WO Practice",
subtitle:"Practice W and O combinations.",
target:["w","w","o","o","w","w","o","o"]
},

9:{
title:"Top Row Mix",
subtitle:"Mix W O R E keys.",
target:["w","o","r","e","w","o","r","e"]
},

10:{
title:"Keys Q & P",
subtitle:"Learn Q and P keys.",
target:["q","p","q","p","q","p","q","p"]
},

11:{
title:"QP Practice",
subtitle:"Practice Q and P combinations.",
target:["q","q","p","p","q","q","p","p"]
},

12:{
title:"Top Row Review",
subtitle:"Review all top row keys.",
target:["q","w","e","r","u","i","o","p"]
},

13:{
title:"Left Hand Practice",
subtitle:"Practice Q W E R keys.",
target:["q","w","e","r","q","w","e","r"]
},

14:{
title:"Right Hand Practice",
subtitle:"Practice U I O P keys.",
target:["u","i","o","p","u","i","o","p"]
},

15:{
title:"Left Drill",
subtitle:"Build speed with QWER.",
target:["q","e","w","r","q","r","w","e"]
},

16:{
title:"Right Drill",
subtitle:"Build speed with UIOP.",
target:["u","o","i","p","u","p","i","o"]
},

17:{
title:"Top Row Mix",
subtitle:"Mixed top row practice.",
target:["q","u","w","i","e","o","r","p"]
},

18:{
title:"Advanced Mix",
subtitle:"Advanced top row combinations.",
target:["r","u","e","i","w","o","q","p"]
},

19:{
title:"Top Row Words",
subtitle:"Top row word practice.",
target:["q","w","e","r","u","i","o","p"]
},

20:{
title:"Final Test",
subtitle:"Complete the top row challenge.",
target:["q","w","e","r","u","i","o","p"]
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

input.addEventListener("input", function(){

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

    if(current < 8){

        document
        .getElementById("l"+current)
        .classList.add("active");

    }

    document
    .getElementById("progress")
    .innerText =
    current + " / 8";

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
       LEVEL COMPLETE
    ========================================= */

    if(current === 8){

let level =
parseInt(
    new URLSearchParams(
        window.location.search
    ).get("id")
    || 1
);

let unlocked =
parseInt(
    localStorage.getItem(
        "topRowCurrentLevel"
    ) || 1
);

if(level >= unlocked){

    localStorage.setItem(
        "topRowCurrentLevel",
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
"level" + level + "Stars",
stars
);

localStorage.setItem(
"level" + level + "Score",
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
"toprowlevel.html?id=" +
(level + 1);

});

/* =========================================
   CAPS LOCK WARNING
========================================= */

document.addEventListener(
"keydown",
function(event){

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