/* =========================================
   LEVEL UNLOCK SYSTEM
========================================= */

let unlocked =
parseInt(
localStorage.getItem(
"currentLevel"
) || 1
);

for(let i=2;i<=20;i++){

    if(i <= unlocked){

        let card =
        document.getElementById(
        "level"+i
        );

        if(card){

            card.classList.remove(
            "locked"
            );

            card.onclick =
function(){

const userUID =
localStorage.getItem(
"userUID"
);

if(!userUID){

alert(
"Please login to start learning."
);

return;

}

window.location.href =
"level.html?id="+i;

};

        }

    }

}

/* =========================================
   LOAD STARS
========================================= */

for(let i=1;i<=20;i++){

    let stars =
    localStorage.getItem(
    "level"+i+"Stars"
    );

    let box =
    document.getElementById(
    "stars"+i
    );

    if(stars && box){

        box.innerText =
        stars;

    }

}

/* =========================================
   LOAD SCORES
========================================= */

for(let i=1;i<=20;i++){

    let score =
    localStorage.getItem(
    "level"+i+"Score"
    );

    let box =
    document.getElementById(
    "score"+i
    );

    if(score && box){

        box.innerText =
        score;

    }

}

/* =========================================
   PERFECT BADGE
========================================= */

for(let i=1;i<=20;i++){

    let stars =
    localStorage.getItem(
    "level"+i+"Stars"
    );

    if(stars === "⭐⭐⭐"){

        let badge =
        document.getElementById(
        "badge"+i
        );

        if(badge){

            badge.innerText =
            "🏆 PERFECT";

        }

    }

}

/* =========================================
   PROGRESS CARD
========================================= */

let currentLevel =
parseInt(
localStorage.getItem(
"currentLevel"
) || 1
);

document
.getElementById("progressCount")
.innerText =
(currentLevel - 1)
+ " / 20";

let percentage =

((currentLevel - 1) / 20)
* 100;

document
.getElementById("progressFill")
.style.width =
percentage + "%";


/* =========================================
   BEST STREAK
========================================= */

let streak =
parseInt(
localStorage.getItem(
"currentLevel"
) || 1
);

document
.getElementById("bestStreak")
.innerText =
(streak - 1) + " Levels";

function openLevel(level){

const userUID =
localStorage.getItem(
"userUID"
);

if(!userUID){

alert(
"Please login to start learning."
);

return;

}

window.location.href =
"level.html?id=" + level;

}
