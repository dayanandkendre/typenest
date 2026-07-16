import { db } from "./firebase-config.js";
import { doc, getDoc, updateDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const userUID = localStorage.getItem("userUID");

// लॉगिन/डॅशबोर्ड इंडिकेटर टॅगल
const loginBtnText = document.getElementById("loginBtnText");
if (userUID && loginBtnText) {
    loginBtnText.innerText = "Dashboard";
    document.getElementById("loginNavBtn").onclick = function() { window.location.href = "dashboard.html"; };
} else if (loginBtnText) {
    document.getElementById("loginNavBtn").onclick = function() { window.location.href = "login.html"; };
}

/* =========================================
   DYNAMIC TEXT & CONFIG STATE ENGINE
========================================= */
let currentType = "normal"; // normal, punctuation
let currentMode = "time";     // time, words
let currentTargetValue = 30;  // 15, 30, 60

let paragraphsNormal = [
    "The little boy walked to the village market every morning with his grandfather. Along the way, they greeted neighbors, watched birds flying across the sky, and enjoyed the fresh morning air. These simple daily walks taught him kindness, patience, and the value of community.",
    "A young traveler decided to explore a small mountain town during his vacation. He spent his days meeting local people, tasting traditional food, and learning about the history of the region. The experience helped him understand different cultures and appreciate new perspectives.",
    "The library was one of the quietest places in the city. Students, teachers, and readers visited every day to discover new ideas and improve their knowledge. Reading books regularly opened doors to imagination, learning, and personal growth.",
    "A farmer worked hard throughout the year to grow healthy crops for his family and community. He carefully planted seeds, watered the fields, and protected the plants from harsh weather. His dedication showed how persistence often leads to success."
];

let paragraphsPunctuation = [
    "Did the little boy walk 5 miles to the market? Yes, he did! Every morning, at 6:00 AM, he helped his grandfather. Wow, what a wonderful routine; it builds great character.",
    "The traveler's guide cost $25.50; however, the mountain view (which was at 4,000 feet) was absolutely priceless! Can you believe it?",
    "Library rule #1: 'Keep perfect silence.' Books like 'Science & History' (published in 2024) are located in Section-B; please read them carefully.",
    "The farmer's fields produced 150kg of corn, 200kg of wheat, and 50kg of rice. Wow! Hard work always results in success, doesn't it?"
];

let originalText = "";
let timer = 30;
let totalInitialTime = 30;
let timerStarted = false;
let interval;
let liveCorrectCount = 0;
let liveAccuracy = 0;
let liveMistakes = 0;
let totalTypedChars = 0;
let lastInputValue = "";
let consecutiveMistakes = 0;

function initTest() {
    clearInterval(interval);
    timerStarted = false;
    liveCorrectCount = 0;
    liveAccuracy = 0;
    liveMistakes = 0;
    totalTypedChars = 0;
    lastInputValue = "";
    consecutiveMistakes = 0;
    
    let pool = (currentType === "punctuation") ? paragraphsPunctuation : paragraphsNormal;
    originalText = pool[Math.floor(Math.random() * pool.length)];

    // जर 'words' मोड असेल, तर पॅराग्राफमधील फक्त निवडक शब्दच समोर ठेवणे
    if (currentMode === "words") {
        let wordsArr = originalText.split(" ");
        originalText = wordsArr.slice(0, currentTargetValue).join(" ");
        document.getElementById("time").innerHTML = currentTargetValue + " words";
    } else {
        timer = currentTargetValue;
        totalInitialTime = currentTargetValue;
        document.getElementById("time").innerHTML = timer;
    }

    let inputField = document.getElementById("input");
    inputField.value = "";
    inputField.disabled = false;
    renderText("");
}

/* =========================================
   CLICK INTERACTION ON CONFIG SUB-BAR
========================================= */
function setupConfigListeners() {
    document.querySelectorAll("#typeGroup .cfg-btn").forEach(btn => {
        btn.onclick = function() {
            document.querySelectorAll("#typeGroup .cfg-btn").forEach(b => b.classList.remove("active-cfg"));
            this.classList.add("active-cfg");
            currentType = this.getAttribute("data-type");
            initTest();
        };
    });

    document.querySelectorAll("#modeGroup .cfg-btn").forEach(btn => {
        btn.onclick = function() {
            document.querySelectorAll("#modeGroup .cfg-btn").forEach(b => b.classList.remove("active-cfg"));
            this.classList.add("active-cfg");
            currentMode = this.getAttribute("data-mode");
            initTest();
        };
    });

    document.querySelectorAll("#timeGroup .cfg-btn").forEach(btn => {
        btn.onclick = function() {
            document.querySelectorAll("#timeGroup .cfg-btn").forEach(b => b.classList.remove("active-cfg"));
            this.classList.add("active-cfg");
            currentTargetValue = parseInt(this.getAttribute("data-value"));
            initTest();
        };
    });
}

function renderText(value = ""){
    let html = "";
    for(let i = 0; i < originalText.length; i++){
        let cls = "pending-char";
        if(i === value.length) cls = "current-char";

        if(i < value.length){
            if(value[i] === originalText[i]) cls = "correct-char";
            else {
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

    const currentChar = document.querySelector(".current-char");
    if(currentChar){
        const container = document.getElementById("textDisplayContainer");
        const x = currentChar.offsetLeft;
        let targetTranslate = (container.offsetWidth / 2) - x;

        if(textDisplay.scrollWidth <= container.offsetWidth) targetTranslate = 0;
        else {
            if(targetTranslate > 0) targetTranslate = 0;
            const maxScroll = container.offsetWidth - textDisplay.scrollWidth - 35;
            if(targetTranslate < maxScroll) targetTranslate = maxScroll;
        }
        textDisplay.style.transform = `translateX(${targetTranslate}px)`;
    }
}

let input = document.getElementById("input");
const keySound = document.getElementById("keySound");

document.body.addEventListener("click", function(){
    if(input && !input.disabled) input.focus();
});

function startTimer(){
    if(!timerStarted && currentMode === "time"){
        timerStarted = true;
        interval = setInterval(function(){
            timer--;
            document.getElementById("time").innerHTML = timer;
            if(timer <= 0){
                clearInterval(interval);
                input.disabled = true;
                endTest();
            }
        }, 1000);
    } else if (!timerStarted && currentMode === "words") {
        timerStarted = true;
        totalInitialTime = Date.now(); // शब्दांच्या मोडमध्ये वेळ मोजण्यासाठी टाइमस्टॅम्प वापरणे
    }
}

function endTest(){
    clearInterval(interval);
    let timeElapsed = 30;
    
    if(currentMode === "time") {
        timeElapsed = totalInitialTime - timer;
    } else {
        timeElapsed = (Date.now() - totalInitialTime) / 1000;
    }
    if(timeElapsed <= 0) timeElapsed = 1;

    let finalNetWpm = Math.floor(liveCorrectCount / 5 / (timeElapsed / 60));
    let rawWpm = Math.round((totalTypedChars / 5) / (timeElapsed / 60));
    let missed = Math.max(0, originalText.length - totalTypedChars);

    document.getElementById("finalWpm").innerText = finalNetWpm;
    document.getElementById("finalAccuracy").innerText = liveAccuracy + "%";
    document.getElementById("finalMistakes").innerText = liveMistakes;
    document.getElementById("rawWpm").innerText = rawWpm;
    document.getElementById("finalChars").innerText = `${liveCorrectCount}/${liveMistakes}/0/${missed}`;
    document.getElementById("resultModeInfo").innerText = `${currentMode} ${currentTargetValue} (${currentType})`;

    let bestWpm = localStorage.getItem("bestWpm") || 0;
    if(finalNetWpm > Number(bestWpm)){
        localStorage.setItem("bestWpm", finalNetWpm);
        bestWpm = finalNetWpm;
    }
    document.getElementById("bestWpm").innerText = bestWpm;

    // डेटा फायरस्टोअरला सेव्ह करणे
    if(userUID) {
        const userRef = doc(db, "users", userUID);
        getDoc(userRef).then(snap => {
            if(snap.exists()) {
                updateDoc(userRef, {
                    testsTaken: (snap.data().testsTaken || 0) + 1,
                    bestWpm: Math.max(snap.data().bestWpm || 0, finalNetWpm),
                    bestAccuracy: Math.max(snap.data().bestAccuracy || 0, liveAccuracy)
                });
                addDoc(collection(db, "history"), { userId: userUID, wpm: finalNetWpm, accuracy: liveAccuracy, date: new Date().toISOString() });
            }
        });
    }
   
    document.getElementById("subConfigWrapper")?.style.setProperty("display", "none"); 
    document.getElementById("typingContainer").style.display = "none";
    document.getElementById("footerShortcut").style.display = "none";
    document.getElementById("resultScreen").style.display = "flex";
}

/* =========================================================
   २ चुकांवर लॉक करणारा इनपुट लिसनर
========================================================= */
input.addEventListener("input", function(){
    let currentVal = this.value;

    if(currentVal.length < lastInputValue.length) {
        lastInputValue = currentVal;
        if(consecutiveMistakes > 0) consecutiveMistakes--;
        processTyping(currentVal);
        return;
    }

    let checkIndex = currentVal.length - 1;
    if (currentVal[checkIndex] === originalText[checkIndex]) {
        consecutiveMistakes = 0;
    } else {
        consecutiveMistakes++;
        if (consecutiveMistakes >= 2) {
            this.value = lastInputValue; 
            consecutiveMistakes = 1;     
            return;
        }
    }

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

    let accuracy = (inputText.length > 0) ? Math.floor((correctCount / inputText.length) * 100) : 100;
    liveCorrectCount = correctCount;
    liveAccuracy = accuracy;
    liveMistakes = mistakes;

    // जर 'words' मोड असेल तर लाइव्ह स्टेटस बदलणे
    if(currentMode === "words") {
        let currentTypedWords = inputText.trim().split(" ").length;
        document.getElementById("time").innerHTML = `${currentTypedWords}/${currentTargetValue} words`;
    }

    if(inputText.length === originalText.length){
        endTest();
    }
}

/* =========================================================
   KEYBOARD SHORTCUT HANDLERS (TAB + ENTER = RESTART)
========================================================= */
let keysPressed = {};
document.addEventListener("keydown", function(event){
    keysPressed[event.key.toLowerCase()] = true;

    if(keysPressed['tab'] && keysPressed['enter']) {
        event.preventDefault();
        location.reload();
    }
    if(event.key === "Escape") {
        event.preventDefault();
        if(input && !input.disabled) input.focus();
    }

    if(event.key.length === 1 || event.key === "Backspace" || event.key === " "){
        if(keySound){ keySound.currentTime = 0; keySound.play().catch(()=>{}); }
    }
});

document.addEventListener("keyup", function(event){
    delete keysPressed[event.key.toLowerCase()];
});

// सुरुवातीला लोड करण्यासाठी
setupConfigListeners();
initTest();
