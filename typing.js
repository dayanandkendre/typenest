import { db } from "./firebase-config.js";

import {
doc,
getDoc,
updateDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const userUID =
localStorage.getItem(
"userUID"
);

console.log(
"USER UID:",
userUID
);

if(userUID){

const userRef =

doc(
db,
"users",
userUID
);

const userSnap =

await getDoc(
userRef
);

if(userSnap.exists()){

console.log(
"USER DATA:",
userSnap.data()
);
   
}

}

async function saveResult(
finalWpm,
accuracy
){

console.log(
"SAVE RESULT:",
finalWpm,
accuracy
);

}

/* =========================================
   PARAGRAPHS
========================================= */

let paragraphs = [

"The little boy walked to the village market every morning with his grandfather. Along the way, they greeted neighbors, watched birds flying across the sky, and enjoyed the fresh morning air. These simple daily walks taught him kindness, patience, and the value of community.",

"A young traveler decided to explore a small mountain town during his vacation. He spent his days meeting local people, tasting traditional food, and learning about the history of the region. The experience helped him understand different cultures and appreciate new perspectives.",

"The library was one of the quietest places in the city. Students, teachers, and readers visited every day to discover new ideas and improve their knowledge. Reading books regularly opened doors to imagination, learning, and personal growth.",

"A farmer worked hard throughout the year to grow healthy crops for his family and community. He carefully planted seeds, watered the fields, and protected the plants from harsh weather. His dedication showed how persistence often leads to success.",

"The blue whale is the largest animal on Earth. Despite its enormous size, it survives by eating tiny creatures called krill. Scientists continue to study these magnificent animals to better understand life in the world's oceans.",

"Many successful people begin their day with a simple routine. They wake up early, exercise, plan their goals, and focus on important tasks. Small daily habits often create positive changes that lead to long-term achievements.",

"A group of friends decided to plant trees in their neighborhood park. They wanted to make the area greener and cleaner for future generations. Their efforts inspired many other residents to participate in environmental activities.",

"The history of human communication has changed dramatically over time. People once relied on handwritten letters that took weeks to arrive. Today, digital technology allows messages to travel across the world within seconds.",

"A curious student became interested in astronomy after watching a documentary about space exploration. He started reading books about planets, stars, and galaxies. Learning about the universe inspired him to ask questions and explore science further.",

"During a rainy afternoon, a family gathered together to play board games and share stories. Laughter filled the room as they spent quality time with one another. These moments created memories that would be remembered for many years.",
   
"The ancient castle stood on top of a hill overlooking the entire valley. Visitors traveled from different places to learn about its history and admire its impressive architecture. The castle remained a symbol of strength and tradition for many generations.",

"A small puppy followed its owner through the garden every afternoon. It chased butterflies, explored new corners, and played happily in the sunshine. Spending time with pets often brings joy, comfort, and companionship to people of all ages.",

"The world's rainforests are home to thousands of unique plants and animals. These ecosystems play an important role in maintaining global climate balance. Protecting forests helps preserve biodiversity and supports the health of our planet.",

"A skilled chef spent years learning how to prepare delicious meals. Through practice and creativity, he developed recipes that people enjoyed sharing with family and friends. Cooking is both a practical skill and a form of artistic expression.",

"The first bicycle ride can feel challenging for many children. However, with patience and determination, they gradually learn to balance and gain confidence. Each small improvement encourages them to keep trying until they succeed.",

"Astronauts undergo extensive training before traveling into space. They learn how to operate equipment, solve technical problems, and adapt to unique conditions. Space exploration continues to expand our understanding of the universe and its mysteries.",

"Every city has its own character shaped by history, culture, and people. Exploring different cities allows travelers to discover new traditions, architecture, and local experiences. Each journey provides opportunities for learning and personal growth.",

"A teacher has the ability to influence the lives of many students. By encouraging curiosity and critical thinking, teachers help learners develop valuable skills for the future. Education remains one of the strongest foundations for success.",

"The invention of the printing press changed the way information was shared across the world. Books became more accessible, knowledge spread faster, and literacy rates gradually improved. This innovation played a major role in human progress.",

"A peaceful lake reflected the colors of the evening sky as the sun slowly disappeared beyond the horizon. Birds returned to their nests while gentle waves moved across the water. Nature often provides moments of beauty that inspire calmness and reflection."

];





/* =========================================
   RANDOM TEXT
========================================= */

let originalText =

paragraphs[
Math.floor(Math.random() * paragraphs.length)
];



/* =========================================
   VARIABLES
========================================= */

/* =========================================
   TIMER FROM URL
========================================= */

let urlParams =

new URLSearchParams(
window.location.search
);



let selectedTime =

urlParams.get("time");



let timer = 60;



if(selectedTime == "1"){

    timer = 60;

}

else if(selectedTime == "3"){

    timer = 180;

}

else if(selectedTime == "5"){

    timer = 300;

}

let timerStarted = false;

let interval;

let liveCorrectCount = 0;

let liveAccuracy = 0;

let liveMistakes = 0;

/* =========================================
   INITIAL TIMER DISPLAY
========================================= */

let timeElement =

document.getElementById("time");


if(timeElement){

    timeElement.innerHTML = timer;

}



/* =========================================
   SHOW TEXT
========================================= */

let textDiv =
document.getElementById("text");


originalText.split("").forEach(function(char){

    let span =
    document.createElement("span");

    span.innerText = char;

    textDiv.appendChild(span);

});



/* =========================================
   HIDDEN INPUT
========================================= */

let input =
document.getElementById("input");
const keySound =
document.getElementById("keySound");

document.body.addEventListener("click",function(){

    input.focus();

});



/* =========================================
   START TIMER
========================================= */

function startTimer(){

    if(timerStarted == false){

        timerStarted = true;

        interval = setInterval(function(){

            timer--;

            let timeElement =

document.getElementById("time");

if(timeElement){

    timeElement.innerHTML =
    timer;

}


if(timer <= 0){

    clearInterval(interval);

    input.disabled = true;

    let finalWpm =

    Math.floor(
    liveCorrectCount / 5
    );

    document
    .getElementById("finalWpm")
    .innerText = finalWpm;

    document
    .getElementById("finalAccuracy")
    .innerText =
    liveAccuracy + "%";

    document
    .getElementById("finalMistakes")
    .innerText =
    liveMistakes;

    let bestWpm =

    localStorage.getItem(
    "bestWpm"
    );

    if(

    bestWpm === null ||

    finalWpm > Number(bestWpm)

    ){

        localStorage.setItem(
        "bestWpm",
        finalWpm
        );

        bestWpm = finalWpm;

    }

    document
    .getElementById("bestWpm")
    .innerText = bestWpm;

    saveResult(
finalWpm,
liveAccuracy
);
   
    let popup =
    document.getElementById(
    "resultPopup"
    );

    popup.style.visibility =
    "visible";

    popup.style.opacity = "1";

    document.querySelector(
    ".typing-box"
    ).style.opacity = "0.25";

    document.querySelector(
    ".keyboard"
    ).style.opacity = "0.15";

}
        },1000);

    }

}



/* =========================================
   TYPING DETECTION
========================================= */

input.addEventListener("input",function(){

    startTimer();

    let inputText =
    this.value;


    let spans =
    document.querySelectorAll("#text span");


    let correctCount = 0;

    let mistakes = 0;



    spans.forEach(function(span,index){

        span.classList.remove("current");

        span.classList.remove("current-word");


        let typedChar =
        inputText[index];



        /* CURRENT LETTER */

        if(index == inputText.length){

            span.classList.add("current");

        }



        /* EMPTY */

       if(typedChar === undefined){

    span.classList.remove("correct");

    span.classList.remove("wrong");

}



        /* CORRECT */

        else if(typedChar === span.innerText){

            span.classList.add("correct");

            span.classList.remove("wrong");

            correctCount++;

        }



        /* WRONG */

        else{

            span.classList.add("wrong");

            span.classList.remove("correct");

            mistakes++;

        }

    });



    /* =========================================
       CURRENT WORD
    ========================================= */

    let words =
    originalText.split(" ");


    let currentWordIndex =
    inputText.split(" ").length - 1;


    let charCount = 0;


    words.forEach(function(word,wordIndex){

        let wordLength =
        word.length + 1;


        if(wordIndex == currentWordIndex){

            for(

                let i = charCount;

                i < charCount + word.length;

                i++

            ){

                if(spans[i]){

                    spans[i].classList.add(
                    "current-word"
                    );

                }

            }

        }

        charCount += wordLength;

    });



    /* =========================================
       WPM
    ========================================= */

    let wpmElement =

document.getElementById("wpm");

if(wpmElement){

    wpmElement.innerHTML =
    totalWords;

}


    /* =========================================
       ACCURACY
    ========================================= */

    let totalTyped =

    correctCount + mistakes;


    let accuracy = 0;


    if(totalTyped > 0){

        accuracy =

        Math.floor(
        (correctCount / totalTyped) * 100
        );

    }


    let accuracyElement =

document.getElementById(
"accuracy"
);

if(accuracyElement){

    accuracyElement.innerHTML =
    accuracy + "%";

}

 let mistakesElement =

document.getElementById(
"mistakes"
);

if(mistakesElement){

    mistakesElement.innerHTML =
    mistakes;

}

liveCorrectCount = correctCount;

liveAccuracy = accuracy;

liveMistakes = mistakes;

  /* =========================================
   PROGRESS BAR
========================================= */

let progress =

(inputText.length / originalText.length) * 100;


let progressBar =
document.getElementById("progressBar");


if(progressBar){

    progressBar.style.width =
    progress + "%";

}

console.log(inputText.length);
console.log(originalText.length);

/* =========================================
   TEST COMPLETE
========================================= */

if(

inputText.length ===
originalText.length

){

    console.log("POPUP WORKING");



    clearInterval(interval);



    /* SHOW RESULT POPUP */

    let popup =

    document.getElementById(
    "resultPopup"
    );



    popup.style.visibility =
    "visible";


    popup.style.opacity = "1";



    /* DIM BACKGROUND */

    document.querySelector(
    ".typing-box"
    ).style.opacity = "0.25";


    document.querySelector(
    ".keyboard"
    ).style.opacity = "0.15";



    /* FINAL VALUES */

    let finalWpm =

    Math.floor(correctCount / 5);



    document
    .getElementById("finalWpm")
    .innerText = finalWpm;



    document
    .getElementById("finalAccuracy")
    .innerText = accuracy + "%";



    document
    .getElementById("finalMistakes")
    .innerText = mistakes;

let bestWpm =

localStorage.getItem(
"bestWpm"
);

if(

bestWpm === null ||

finalWpm > Number(bestWpm)

){

    localStorage.setItem(
    "bestWpm",
    finalWpm
    );

    bestWpm = finalWpm;

}

document
.getElementById("bestWpm")
.innerText = bestWpm;
 
   saveResult(
finalWpm,
liveAccuracy
);   

}
 
 });



/* =========================================
   LIVE KEYBOARD
========================================= */

document.addEventListener("keydown", function(event){

   if(

event.key.length === 1 ||

event.key === "Backspace" ||

event.key === " "

){

    keySound.currentTime = 0;

    keySound.play().catch(()=>{});

}

    document.querySelectorAll(".key")
    .forEach(function(key){

        key.classList.remove("active-key");

    });


    let pressedKey = event.key;


    if(pressedKey === " "){

        pressedKey = "Space";

    }

    else if(pressedKey === "Backspace"){

        pressedKey = "Backspace";

    }

    else if(pressedKey === "Enter"){

        pressedKey = "Enter";

    }

    else if(pressedKey === "Shift"){

        pressedKey = "Shift";

    }

    else{

        pressedKey = pressedKey.toUpperCase();

    }


    document.querySelectorAll(".key")
    .forEach(function(key){

        if(key.innerText === pressedKey){

            key.classList.add("active-key");

        }

    });

});
