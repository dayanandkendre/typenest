import { db } from "./firebase-config.js";
import { doc, getDoc, updateDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const userUID = localStorage.getItem("userUID");

// १. युझर लॉगिन/डॅशबोर्ड इंडिकेटर
const loginBtnText = document.getElementById("loginBtnText");
if (userUID && loginBtnText) {
    loginBtnText.innerText = "Dashboard";
    document.getElementById("loginNavBtn").onclick = function() {
        window.location.href = "dashboard.html";
    };
} else if (loginBtnText) {
    document.getElementById("loginNavBtn").onclick = function() {
        window.location.href = "login.html";
    };
}

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
   CORE PARAGRAPHS MATRIX
========================================= */
let paragraphs = [
    "The little boy walked to the village market every morning with his grandfather. Along the way, they greeted neighbors, watched birds flying across the sky, and enjoyed the fresh morning air. These simple daily walks taught him kindness, patience, and the value of community.",
    "A young traveler decided to explore a small mountain town during his vacation. He spent his days meeting local people, tasting traditional food, and learning about the history of the region. The experience helped him understand different cultures and appreciate new perspectives.",
    "The library was one of the quietest places in the city. Students, teachers, and readers visited every day to discover new ideas and improve their knowledge. Reading books regularly opened doors to imagination, learning, and personal growth.",
    "A farmer worked hard throughout the year to grow healthy crops for his family and community. He carefully planted seeds, watered the fields, and protected the plants from harsh weather. His dedication showed how persistence often leads to success."
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
let totalTypedChars = 0;

// आधीच्या इनपुट व्हॅल्यू आणि सलग किती चुका झाल्या याचा ट्रॅक ठेवण्यासाठी
let lastInputValue = ""; 
let consecutiveMistakes = 0; 

let timeElement = document.getElementById("time");
if(timeElement) timeElement.innerHTML = timer;

function renderText(value = ""){
    let html = "";
    for(let i = 0; i < originalText.length; i++){
        let cls = "pending-char";

        if(i === value.length) cls = "current-char";

        if(i < value.length){
            if(value[i] === originalText[i]){
                cls = "correct-char";
            } else {
                cls = "wrong-char";
                if(originalText[i] === " ") cls += " wrong-space";
            }
        }

        let ch = originalText[i];
        if(ch === " ") ch = "&nbsp;";

        html += `<span class="${cls}">${ch}</span>`;
    }

    const textDisplay = document.getElementById("textDisplay");
    textDisplay.innerHTML = html;

    /* HORIZONTAL SCROLL EFFECT */
    const currentChar = document.querySelector(".current-char");
    if(currentChar){
        const container = document.getElementById("textDisplayContainer");
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
    if(input && !input.disabled) input.focus();
});

function startTimer(){
    if(!timerStarted){
        timerStarted = true;
        interval = setInterval(function(){
            timer--;
            if(timeElement) timeElement.innerHTML = timer;

            if(timer <= 0){
                clearInterval(interval);
                input.disabled = true;
                endTest();
            }
        }, 1000);
    }
}

function endTest(){
    let finalNetWpm = Math.floor(liveCorrectCount / 5);
    let timeElapsed = totalInitialTime - timer;
    if(timeElapsed <= 0) timeElapsed = 60;
    let rawWpm = Math.round((totalTypedChars / 5) / (timeElapsed / 60));

    let missed = originalText.length - totalTypedChars;
    if(missed < 0) missed = 0;
    let charFormattedStr = `${liveCorrectCount}/${liveMistakes}/0/${missed}`;

    document.getElementById("finalWpm").innerText = finalNetWpm;
    document.getElementById("finalAccuracy").innerText = liveAccuracy + "%";
    document.getElementById("finalMistakes").innerText = liveMistakes;
    document.getElementById("rawWpm").innerText = rawWpm;
    document.getElementById("finalChars").innerText = charFormattedStr;

    let bestWpm = localStorage.getItem("bestWpm") || 0;
    if(finalNetWpm > Number(bestWpm)){
        localStorage.setItem("bestWpm", finalNetWpm);
        bestWpm = finalNetWpm;
    }
    document.getElementById("bestWpm").innerText = bestWpm;

    saveResult(finalNetWpm, liveAccuracy);
   
    document.getElementById("liveConfigBar").style.display = "none";
    document.getElementById("typingContainer").style.display = "none";
    document.getElementById("resultScreen").style.display = "flex";
}

/* =========================================================
   🏆 DYNAMIC CONSECUTIVE ERROR LOCK ENGINE (२ चुकांवर लॉक लॉजिक)
========================================================= */
input.addEventListener("input", function(e){
    let currentVal = this.value;

    // जर युझर Backspace दाबून मागे जात असेल, तर चुकांचा काउंटर कमी करून जाऊ देणे
    if(currentVal.length < lastInputValue.length) {
        lastInputValue = currentVal;
        if(consecutiveMistakes > 0) consecutiveMistakes--;
        processTyping(currentVal);
        return;
    }

    let checkIndex = currentVal.length - 1;
    let isCurrentCharCorrect = currentVal[checkIndex] === originalText[checkIndex];

    if (isCurrentCharCorrect) {
        // जर युझरने बरोबर अक्षर दाबले, तर सलग चुकांचा काउंटर शून्य (Reset) होईल
        consecutiveMistakes = 0;
    } else {
        // जर अक्षर चुकले, तर चुकांचा काउंटर १ ने वाढवणे
        consecutiveMistakes++;

        // 🚨 मुख्य कंडिशन: जर सलग २ अक्षरे चुकीची टाईप झाली असतील, तर कर्सर लॉक करणे!
        if (consecutiveMistakes >= 2) {
            this.value = lastInputValue; // इनपुट जुन्या जागेवर रिस्टोर करा
            consecutiveMistakes = 1;     // काउंटर १ वरच ठेवा जेणेकरून बॅकस्पेस किंवा बरोबर की दाबल्यावर काम करेल
            return;
        }
    }

    // इनपुट व्हॅल्यू अपडेट करून टायपिंग प्रोसेस करणे
    lastInputValue = this.value;
    processTyping(this.value);
});

function processTyping(inputText) {
    startTimer();
    totalTypedChars = inputText.length;

    let correctCount = 0;
    let mistakes = 0;

    for (let i = 0; i < inputText.length; i++) {
        if (inputText[i] === originalText[i]) correctCount++;
        else mistakes++;
    }

    renderText(inputText);

    let accuracy = 100;
    if(inputText.length > 0){
        accuracy = Math.floor((correctCount / inputText.length) * 100);
    }

    liveCorrectCount = correctCount;
    liveAccuracy = accuracy;
    liveMistakes = mistakes;

    if(inputText.length === originalText.length){
        clearInterval(interval);
        endTest();
    }
}

document.addEventListener("keydown", function(event){
    if(event.key.length === 1 || event.key === "Backspace" || event.key === " "){
        if(keySound){
            keySound.currentTime = 0;
            keySound.play().catch(()=>{});
        }
    }
});
