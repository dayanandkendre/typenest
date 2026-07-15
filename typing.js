import { db } from "./firebase-config.js";
import { doc, getDoc, updateDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

let paragraphs = [
    "The little boy walked to the village market every morning with his grandfather. Along the way, they greeted neighbors, watched birds flying across the sky, and enjoyed the fresh morning air. These simple daily walks taught him kindness, patience, and the value of community.",
    "A young traveler decided to explore a small mountain town during his vacation. He spent his days meeting local people, tasting traditional food, and learning about the history of the region. The experience helped him understand different cultures and appreciate new perspectives.",
    "The library was one of the quietest places in the city. Students, teachers, and readers visited every day to discover new ideas and improve their knowledge. Reading books regularly opened doors to imagination, learning, and personal growth.",
    "The blue whale is the largest animal on Earth. Despite its enormous size, it survives by eating tiny creatures called krill. Scientists continue to study these magnificent animals to better understand life in the world's oceans."
];

let originalText = paragraphs[Math.floor(Math.random() * paragraphs.length)];

let urlParams = new URLSearchParams(window.location.search);
let selectedTime = urlParams.get("time");
let totalInitialTime = selectedTime == "3" ? 180 : (selectedTime == "5" ? 300 : 60);
let timer = totalInitialTime;

let timerStarted = false;
let interval;
let liveCorrectCount = 0;
let liveAccuracy = 0;
let liveMistakes = 0;

let timeElement = document.getElementById("time");
if(timeElement) timeElement.innerHTML = timer;

function renderText(value = "") {
    // सध्या युझर कितव्या शब्दावर आहे ते स्पेस मोजून काढणे
    let currentWordIndex = 0;
    for (let i = 0; i < value.length; i++) {
        if (originalText[i] === " ") currentWordIndex++;
    }

    let html = "";
    let tempWordIndex = 0;

    for (let i = 0; i < originalText.length; i++) {
        let cls = "pending-char";

        // चालू शब्दाला ओळखून हायलाइट देणे
        if (tempWordIndex === currentWordIndex) {
            cls += " current-word";
        }
        
        // चालू अक्षरावर अंडरलाईन कर्सर देणे
        if (i === value.length) {
            cls += " current";
        }

        if (i < value.length) {
            if (value[i] === originalText[i]) cls += " correct";
            else cls += " wrong";
        }

        let ch = originalText[i];
        if (ch === " ") {
            ch = "&nbsp;";
            tempWordIndex++; // स्पेस आल्यावर पुढचा शब्द सुरू होतो
        }

        html += `<span class="${cls}">${ch}</span>`;
    }

    const textDisplay = document.getElementById("textDisplay");
    textDisplay.innerHTML = html;

    // हॉरिझॉन्टल स्क्रोल मॅनेजमेंट
    const currentChar = document.querySelector(".current");
    if (currentChar) {
        const container = document.getElementById("textDisplayContainer");
        const containerWidth = container.offsetWidth;
        const textWidth = textDisplay.scrollWidth;
        const x = currentChar.offsetLeft;
        const center = containerWidth / 2;

        let targetTranslate = center - x;

        if (textWidth <= containerWidth) {
            targetTranslate = 0;
        } else {
            if (targetTranslate > 0) targetTranslate = 0;
            const maxScroll = containerWidth - textWidth - 30;
            if (targetTranslate < maxScroll) targetTranslate = maxScroll;
        }
        textDisplay.style.transform = `translateX(${targetTranslate}px)`;
    }
}

renderText();

let input = document.getElementById("input");
const keySound = document.getElementById("keySound");

document.body.addEventListener("click", function() {
    input.focus();
});

function startTimer() {
    if (!timerStarted) {
        timerStarted = true;
        interval = setInterval(function() {
            timer--;
            if (timeElement) timeElement.innerHTML = timer;

            if (timer <= 0) {
                clearInterval(interval);
                input.disabled = true;
                endTest();
            }
        }, 1000);
    }
}

function endTest() {
    let finalWpm = Math.floor(liveCorrectCount / 5);
    document.getElementById("finalWpm").innerText = finalWpm;
    document.getElementById("finalAccuracy").innerText = liveAccuracy + "%";
    document.getElementById("finalMistakes").innerText = liveMistakes;

    let bestWpm = localStorage.getItem("bestWpm");
    if (bestWpm === null || finalWpm > Number(bestWpm)) {
        localStorage.setItem("bestWpm", finalWpm);
        bestWpm = finalWpm;
    }
    document.getElementById("bestWpm").innerText = bestWpm;

    saveResult(finalWpm, liveAccuracy);

    document.getElementById("resultPopup").style.visibility = "visible";
    document.getElementById("resultPopup").style.opacity = "1";
    document.querySelector(".typing-box").style.opacity = "0.25";
    document.querySelector(".keyboard").style.opacity = "0.15";
}

input.addEventListener("input", function() {
    startTimer();
    let inputText = this.value;

    let correctCount = 0;
    let mistakes = 0;

    for (let i = 0; i < inputText.length; i++) {
        if (inputText[i] === originalText[i]) correctCount++;
        else mistakes++;
    }

    renderText(inputText);

    let timeElapsed = totalInitialTime - timer;
    let wpmElement = document.getElementById("wpm");
    if (timeElapsed > 0) {
        let elapsedMinutes = timeElapsed / 60;
        let correctCharacters = correctCount - mistakes;
        if (correctCharacters < 0) correctCharacters = 0;
        let currentLiveWpm = Math.round((correctCharacters / 5) / elapsedMinutes);
        if (wpmElement) wpmElement.innerHTML = currentLiveWpm;
    }

    let totalTyped = correctCount + mistakes;
    let accuracy = (totalTyped > 0) ? Math.floor((correctCount / totalTyped) * 100) : 0;

    let accuracyElement = document.getElementById("accuracy");
    if(accuracyElement) accuracyElement.innerHTML = accuracy + "%";

    let mistakesElement = document.getElementById("mistakes");
    if(mistakesElement) mistakesElement.innerHTML = mistakes;

    liveCorrectCount = correctCount;
    liveAccuracy = accuracy;
    liveMistakes = mistakes;

    if (inputText.length === originalText.length) {
        clearInterval(interval);
        endTest();
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key.length === 1 || event.key === "Backspace" || event.key === " ") {
        keySound.currentTime = 0;
        keySound.play().catch(() => {});
    }

    document.querySelectorAll(".key").forEach(k => k.classList.remove("active-key"));
    let pressedKey = event.key;
    if (pressedKey === " ") pressedKey = "Space";
    else if (pressedKey === "Backspace" || pressedKey === "Enter" || pressedKey === "Shift") {}
    else pressedKey = pressedKey.toUpperCase();

    document.querySelectorAll(".key").forEach(key => {
        if (key.innerText === pressedKey) key.classList.add("active-key");
    });
});
