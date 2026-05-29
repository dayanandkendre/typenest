/* =========================================
   PARAGRAPHS
========================================= */

let paragraphs = [

"Typing regularly improves your focus,  every year.",

"Frontend experiences.",

"Creative thinking technology industry."

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

                alert("Time Up");

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
