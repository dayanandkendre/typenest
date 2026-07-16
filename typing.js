import { db } from "./firebase-config.js";

import {
doc,
getDoc,
updateDoc,
collection,
addDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const userUID = localStorage.getItem("userUID");

async function saveResult(finalWpm, accuracy){
    if(!userUID) return;
    const userRef = doc(db, "users", userUID);
    const userSnap = await getDoc(userRef);

    if(userSnap.exists()){
        const currentData = userSnap.data();
        await updateDoc(userRef, {
            testsTaken: (currentData.testsTaken || 0) + 1,
            bestWpm: Math.max(currentData.bestWpm || 0, finalWpm),
            bestAccuracy: Math.max(currentData.bestAccuracy || 0, accuracy)
        });

        await addDoc(collection(db, "history"), {
            userId: userUID,
            wpm: finalWpm,
            accuracy: accuracy,
            date: new Date().toISOString()
        });
    }
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
    "The history of human communication has changed dramatically over time. People once relied on handwritten letters that took weeks to arrive. Today, digital technology allows messages to travel across the world within seconds."
];

let originalText = paragraphs[Math.floor(Math.random() * paragraphs.length)];

let urlParams = new URLSearchParams(window.location.search);
let selectedTime = urlParams.get("time");

let totalInitialTime = 60;
let timer = 60;

if(selectedTime == "1") timer = 60;
else if(selectedTime == "3") timer = 180;
else if(selectedTime == "5") timer = 300;
totalInitialTime = timer;

let timerStarted = false;
let interval;
let liveCorrectCount = 0;
let liveAccuracy = 0;
let liveMistakes = 0;

let timeElement = document.getElementById("time");
if(timeElement){
    let mins = Math.floor(timer / 60);
    let secs = timer % 60;
    timeElement.innerHTML = String(mins).padStart(2,"0") + ":" + String(secs).padStart(2,"0");
}

/* =========================================
   ROBUST RENDER + HORIZONTAL SCROLL LOGIC
========================================= */
function renderText(value = ""){
    let currentWordIndex = 0;
    for(let i = 0; i < value.length; i++){
        if(originalText[i] === " ") {
            currentWordIndex++;
        }
    }

    let html = "";
    let tempWordIndex = 0;

    for(let i = 0; i < originalText.length; i++){
        let cls = "pending-char";

        if(tempWordIndex === currentWordIndex) cls += " active-word";
        if(i === value.length) cls += " current-char";

        if(i < value.length){
            if(value[i] === originalText[i]){
                cls = "correct-char";
            } else {
                cls = "wrong-char";
                if(originalText[i] === " ") cls += " wrong-space";
            }
        }

        let ch = originalText[i];
        if(ch === " "){
            ch = "&nbsp;";
            tempWordIndex++;
        }

        html += `<span class="${cls}">${ch}</span>`;
    }

    const textDisplay = document.getElementById("textDisplay");
    textDisplay.innerHTML = html;

    /* HORIZONTAL CLAMPED SCROLL */
    const currentChar = document.querySelector(".current-char");
    if(currentChar){
        const container = document.querySelector(".text-display");
        const containerWidth = container.offsetWidth;
        const textWidth = textDisplay.scrollWidth;
        const x = currentChar.offsetLeft;
        const center = containerWidth / 2;

        let targetTranslate = center - x;

        if(textWidth <= containerWidth){
            targetTranslate = 0;
        } else {
            if(targetTranslate > 0) targetTranslate = 0;
            const maxScroll = containerWidth - textWidth - 35;
            if(targetTranslate < maxScroll) targetTranslate = maxScroll;
        }
        textDisplay.style.transform = `translateX(${targetTranslate}px)`;
    }
}

renderText();

let input = document.getElementById("input");
const keySound = document.getElementById("keySound");

document.body.addEventListener("click", function(){
    input.focus();
});

function startTimer(){
    if(!timerStarted){
        timerStarted = true;
        interval = setInterval(function(){
            timer--;

            let mins = Math.floor(timer / 60);
            let secs = timer % 60;
            if(timeElement){
                timeElement.innerHTML = String(mins).padStart(2,"0") + ":" + String(secs).padStart(2,"0");
            }

            if(timer <= 0){
                clearInterval(interval);
                input.disabled = true;
                endTest();
            }
        }, 1000);
    }
}

function endTest(){
    let finalWpm = Math.floor(liveCorrectCount / 5);

    document.getElementById("finalWpm").innerText = finalWpm;
    document.getElementById("finalAccuracy").innerText = liveAccuracy + "%";
    document.getElementById("finalMistakes").innerText = liveMistakes;

    let bestWpm = localStorage.getItem("bestWpm");
    if(bestWpm === null || finalWpm > Number(bestWpm)){
        localStorage.setItem("bestWpm", finalWpm);
        bestWpm = finalWpm;
    }
    document.getElementById("bestWpm").innerText = bestWpm;

    saveResult(finalWpm, liveAccuracy);
   
    document.getElementById("resultPopup").style.display = "flex";
}

input.addEventListener("input", function(){
    startTimer();
    let inputText = this.value;

    let correctCount = 0;
    let mistakes = 0;

    for (let i = 0; i < inputText.length; i++) {
        if (inputText[i] === originalText[i]) correctCount++;
        else mistakes++;
    }

    renderText(inputText);

    document.getElementById("mistakes").innerText = mistakes;
    
    let accuracy = 100;
    if(inputText.length > 0){
        accuracy = Math.floor((correctCount / inputText.length) * 100);
    }
    document.getElementById("accuracy").innerText = accuracy + "%";

    let progress = (inputText.length / originalText.length) * 100;
    if(document.getElementById("progressFill")){
        document.getElementById("progressFill").style.width = progress + "%";
    }
    if(document.getElementById("progress")){
        document.getElementById("progress").innerText = Math.round(progress) + "%";
    }

    /* LIVE PROFESSIONAL NET WPM */
    let timeElapsed = totalInitialTime - timer;
    let wpmElement = document.getElementById("wpm");
    if(timeElapsed > 0 && wpmElement){
        let elapsedMinutes = timeElapsed / 60;
        let correctCharacters = correctCount - mistakes;
        if(correctCharacters < 0) correctCharacters = 0;
        
        let currentLiveWpm = Math.round((correctCharacters / 5) / elapsedMinutes);
        wpmElement.innerHTML = currentLiveWpm;
    }

    liveCorrectCount = correctCount;
    liveAccuracy = accuracy;
    liveMistakes = mistakes;

    if(inputText.length === originalText.length){
        clearInterval(interval);
        endTest();
    }
});

/* CLEAN SOUND ANIMATION ONLY */
document.addEventListener("keydown", function(event){
    if(event.key.length === 1 || event.key === "Backspace" || event.key === " "){
        if(keySound){
            keySound.currentTime = 0;
            keySound.play().catch(()=>{});
        }
    }
});
