// assets/js/typing-engine.js - Adaptive Desktop Engine & Firebase Auto-Save
(function () {
  let audioCtx = null;
  let isSoundEnabled = true;

  function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  function playKeyClickSound() {
    if (!isSoundEnabled) return;
    initAudio();
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450 + Math.random() * 80, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {}
  }

  function playErrorSound() {
    if (!isSoundEnabled) return;
    initAudio();
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {}
  }

  window.toggleSound = function () {
    isSoundEnabled = !isSoundEnabled;
    const icon = document.getElementById('soundIcon');
    if (icon) {
      icon.className = isSoundEnabled ? 'fa-solid fa-volume-high text-sm' : 'fa-solid fa-volume-xmark text-sm text-slate-500';
    }
  };

  let targetText = "";
  let currentIndex = 0;
  let correctCount = 0;
  let errorCount = 0;
  let totalTypedCount = 0;
  let startTime = null;
  let durationSeconds = 60;
  let timeRemaining = 60;
  let timerInterval = null;
  let isTestActive = false;
  let isTestCompleted = false;

  // Auto-inject Keyboard on Desktop & Clean Notice Card on Mobile
  function injectAdaptiveKeyboard() {
    const keyboardContainer = document.getElementById('keyboardWrapper');
    if (!keyboardContainer) return;

    keyboardContainer.innerHTML = `
      <!-- Desktop 5-Row Mechanical Keyboard -->
      <div class="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 shadow-lg hidden md:block select-none">
        <div class="flex items-center justify-between mb-3 text-xs text-slate-400 font-medium">
          <span class="flex items-center gap-2">
            <i class="fa-solid fa-hands text-indigo-400"></i> Touch Typing Finger Placement & Live Keyboard
          </span>
          <span class="text-slate-400">
            <span class="inline-block w-2.5 h-2.5 rounded-sm bg-indigo-500 mr-1"></span> Active Key 
            <span class="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-500/50 ml-3 mr-1"></span> Home Row Anchor (F / J)
          </span>
        </div>
        <div id="virtualKeyboard" class="space-y-1.5 max-w-4xl mx-auto font-mono text-xs">
          <!-- Row 1 -->
          <div class="flex justify-center gap-1.5">
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center" data-key="\`">\`</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center" data-key="1">1</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center" data-key="2">2</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center" data-key="3">3</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center" data-key="4">4</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center" data-key="5">5</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center" data-key="6">6</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center" data-key="7">7</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center" data-key="8">8</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center" data-key="9">9</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center" data-key="0">0</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center" data-key="-">-</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center" data-key="=">=</div>
            <div class="key-cap w-16 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-[10px]" data-key="backspace">Back</div>
          </div>
          <!-- Row 2 -->
          <div class="flex justify-center gap-1.5">
            <div class="key-cap w-14 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-[10px]" data-key="tab">Tab</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold" data-key="q">Q</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold" data-key="w">W</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold" data-key="e">E</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold" data-key="r">R</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold" data-key="t">T</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold" data-key="y">Y</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold" data-key="u">U</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold" data-key="i">I</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold" data-key="o">O</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold" data-key="p">P</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center" data-key="[">[</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center" data-key="]">]</div>
            <div class="key-cap w-11 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center" data-key="\\">\\</div>
          </div>
          <!-- Row 3 -->
          <div class="flex justify-center gap-1.5">
            <div class="key-cap w-16 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-[10px]" data-key="capslock">Caps</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-bold" data-key="a">A</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-bold" data-key="s">S</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-bold" data-key="d">D</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 flex items-center justify-center font-bold underline decoration-emerald-400 decoration-2 underline-offset-4" data-key="f">F</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-bold" data-key="g">G</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-bold" data-key="h">H</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 flex items-center justify-center font-bold underline decoration-emerald-400 decoration-2 underline-offset-4" data-key="j">J</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-bold" data-key="k">K</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-bold" data-key="l">L</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-bold" data-key=";">;</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center" data-key="'">'</div>
            <div class="key-cap w-16 h-10 rounded-lg bg-indigo-600/80 border border-indigo-500/80 text-white flex items-center justify-center text-[10px] font-bold" data-key="enter">Enter</div>
          </div>
          <!-- Row 4 -->
          <div class="flex justify-center gap-1.5">
            <div class="key-cap w-20 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-[10px]" data-key="shift">Shift</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold" data-key="z">Z</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold" data-key="x">X</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold" data-key="c">C</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold" data-key="v">V</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold" data-key="b">B</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold" data-key="n">N</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold" data-key="m">M</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold" data-key=",">,</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold" data-key=".">.</div>
            <div class="key-cap w-9 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold" data-key="/">/</div>
            <div class="key-cap w-20 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-[10px]" data-key="shift">Shift</div>
          </div>
          <!-- Row 5 -->
          <div class="flex justify-center gap-1.5">
            <div class="key-cap w-16 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-[10px]">Ctrl</div>
            <div class="key-cap w-14 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-[10px]">Alt</div>
            <div class="key-cap w-72 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-xs tracking-wider font-semibold" data-key=" ">SPACEBAR</div>
            <div class="key-cap w-14 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-[10px]">Alt</div>
            <div class="key-cap w-16 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-[10px]">Ctrl</div>
          </div>
        </div>
      </div>

      <!-- Mobile Desktop Recommended Card -->
      <div class="block md:hidden bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-xl">
        <div class="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-2xl mx-auto border border-indigo-500/20">
          <i class="fa-solid fa-laptop"></i>
        </div>
        <div>
          <h3 class="text-base font-bold text-white">Best Experienced with a Hardware Keyboard</h3>
          <p class="text-slate-400 text-xs mt-1.5 leading-relaxed">
            Touch typing requires 10-finger muscle memory. Connect a physical keyboard or open TypeNest on your Laptop / PC for tests.
          </p>
        </div>
        <div class="flex flex-col gap-2 pt-1">
          <a href="courses.html" class="py-2.5 px-4 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md">
            Explore Typing Courses
          </a>
          <a href="blog.html" class="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-700">
            Read Speed Guides & Tips
          </a>
        </div>
      </div>
    `;
  }

  window.startTypingSession = function (text, duration = 60) {
    clearInterval(timerInterval);
    isTestActive = false;
    isTestCompleted = false;
    currentIndex = 0;
    correctCount = 0;
    errorCount = 0;
    totalTypedCount = 0;
    startTime = null;
    durationSeconds = duration;
    timeRemaining = duration;

    targetText = text;

    const display = document.getElementById('textDisplay');
    if (!display) return;
    display.innerHTML = '';

    for (let i = 0; i < targetText.length; i++) {
      const span = document.createElement('span');
      span.id = `char-${i}`;
      span.textContent = targetText[i];
      if (i === 0) span.className = 'typing-cursor text-slate-300 font-semibold';
      display.appendChild(span);
    }

    updateHUD();
    updateKeyHighlight();
  };

  function updateKeyHighlight() {
    document.querySelectorAll('.key-cap').forEach(el => el.classList.remove('key-active'));
    if (currentIndex < targetText.length) {
      const expected = targetText[currentIndex].toLowerCase();
      const keyCap = document.querySelector(`.key-cap[data-key="${expected}"]`);
      if (keyCap) keyCap.classList.add('key-active');
    }
  }

  function updateHUD() {
    let elapsedMins = startTime ? (Date.now() - startTime) / 60000 : 0;
    let wpm = elapsedMins > 0.03 ? Math.round((correctCount / 5) / elapsedMins) : 0;
    let accuracy = totalTypedCount > 0 ? Math.max(0, Math.round((correctCount / totalTypedCount) * 100)) : 100;

    const elWpm = document.getElementById('statWPM');
    const elAcc = document.getElementById('statAccuracy');
    const elErr = document.getElementById('statErrors');
    const elChars = document.getElementById('statChars');
    const elTimer = document.getElementById('statTimer');

    if (elWpm) elWpm.innerText = wpm;
    if (elAcc) elAcc.innerHTML = `${accuracy}<span class="text-lg font-normal">%</span>`;
    if (elErr) elErr.innerText = errorCount;
    if (elChars) elChars.innerText = totalTypedCount;

    if (elTimer) {
      if (durationSeconds > 0) {
        const mins = Math.floor(timeRemaining / 60);
        const secs = timeRemaining % 60;
        elTimer.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      } else {
        const mins = Math.floor(timeRemaining / 60);
        const secs = timeRemaining % 60;
        elTimer.innerText = `Zen ${mins}:${secs.toString().padStart(2, '0')}`;
      }
    }
  }

  // Desktop Keydown Engine
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Tab' || e.key === 'Alt' || e.key === 'Control' || e.key === 'Meta') return;
    if (e.key === 'Escape') {
      if (window.resetCurrentTest) window.resetCurrentTest();
      return;
    }
    if (isTestCompleted) return;

    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      if (activeEl.id !== 'mobileInputSink') return;
    }

    if (activeEl && activeEl.tagName === 'BUTTON') activeEl.blur();

    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
    }

    if (!isTestActive) {
      isTestActive = true;
      startTime = Date.now();
      if (durationSeconds > 0) {
        timerInterval = setInterval(() => {
          timeRemaining--;
          updateHUD();
          if (timeRemaining <= 0) finishSession();
        }, 1000);
      } else {
        timerInterval = setInterval(() => {
          timeRemaining++;
          updateHUD();
        }, 1000);
      }
    }

    const expectedChar = targetText[currentIndex];
    const charSpan = document.getElementById(`char-${currentIndex}`);

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (currentIndex > 0) {
        if (charSpan) charSpan.className = '';
        currentIndex--;
        const prevSpan = document.getElementById(`char-${currentIndex}`);
        if (prevSpan) prevSpan.className = 'typing-cursor text-slate-300';
        updateKeyHighlight();
      }
      return;
    }

    if (e.key.length > 1 && e.key !== 'Enter') return;

    totalTypedCount++;
    if (e.key === expectedChar) {
      playKeyClickSound();
      correctCount++;
      if (charSpan) charSpan.className = 'text-emerald-400 font-medium';
    } else {
      playErrorSound();
      errorCount++;
      if (charSpan) charSpan.className = 'text-rose-400 bg-rose-500/20 underline decoration-rose-500 rounded px-0.5';
    }

    currentIndex++;

    if (currentIndex < targetText.length) {
      const nextSpan = document.getElementById(`char-${currentIndex}`);
      if (nextSpan) nextSpan.classList.add('typing-cursor');
      updateKeyHighlight();
    } else {
      finishSession();
    }
    updateHUD();
  });

  // FIREBASE AUTO SAVE PROGRESS (History + Users stats update)
  async function saveProgressToFirebase(finalWPM, finalAcc, totalTypedCount, errorCount) {
    const uid = localStorage.getItem("userUID");
    if (!uid) return;

    try {
      const { collection, addDoc, doc, updateDoc, increment } = await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js");
      const { db } = await import("./firebase-config.js");

      // 1. Save in history collection (profile.js can read this)
      await addDoc(collection(db, "history"), {
        userId: uid,
        wpm: finalWPM,
        accuracy: finalAcc,
        chars: totalTypedCount,
        errors: errorCount,
        date: new Date().toISOString()
      });

      // 2. Increment tests taken in users profile
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        testsTaken: increment(1)
      });
      console.log("Progress saved to Firebase!");
    } catch (e) {
      console.error("Firebase save error:", e);
    }
  }

  function finishSession() {
    clearInterval(timerInterval);
    isTestActive = false;
    isTestCompleted = true;

    let elapsedMins = (Date.now() - (startTime || Date.now())) / 60000;
    if (elapsedMins < 0.05) elapsedMins = 0.05;

    const finalWPM = Math.round((correctCount / 5) / elapsedMins);
    const finalAcc = totalTypedCount > 0 ? Math.round((correctCount / totalTypedCount) * 100) : 100;

    // Trigger Firebase save
    saveProgressToFirebase(finalWPM, finalAcc, totalTypedCount, errorCount);

    if (typeof window.showResultsModal === 'function') {
      window.showResultsModal(finalWPM, finalAcc, totalTypedCount, errorCount);
    }
  }

  // Master Results Modal Component
  function injectResultsModal() {
    const modalHTML = `
    <div id="resultsModal" class="hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        <div class="text-center">
          <div class="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-3xl mx-auto mb-4 border border-indigo-500/30">
            <i class="fa-solid fa-flag-checkered"></i>
          </div>
          <h3 class="text-2xl font-bold text-white">Test Completed!</h3>
          <p class="text-slate-400 text-xs mt-1">Verified throughput breakdown:</p>
        </div>

        <div class="grid grid-cols-2 gap-3 my-6">
          <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span class="text-xs uppercase text-slate-400 font-bold">Gross WPM</span>
            <div id="modalWPM" class="text-3xl font-extrabold text-indigo-400 font-mono mt-1">0</div>
          </div>
          <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span class="text-xs uppercase text-slate-400 font-bold">Accuracy</span>
            <div id="modalAccuracy" class="text-3xl font-extrabold text-emerald-400 font-mono mt-1">0%</div>
          </div>
        </div>

        <div class="space-y-2.5">
          <a href="certificate.html" class="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-95 text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25">
            <i class="fa-solid fa-award"></i> View Official Certificate
          </a>
          <button onclick="closeResultsModal(); if(window.resetCurrentTest) window.resetCurrentTest();" class="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-2">
            <i class="fa-solid fa-rotate-right"></i> Try Again
          </button>
        </div>
      </div>
    </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  window.showResultsModal = function (wpm, accuracy, totalChars, errors) {
    document.getElementById('modalWPM').innerText = wpm;
    document.getElementById('modalAccuracy').innerText = accuracy + '%';
    document.getElementById('resultsModal').classList.remove('hidden');

    localStorage.setItem('typenest_wpm', wpm);
    localStorage.setItem('typenest_acc', accuracy);

    if (typeof confetti === 'function' && accuracy >= 90) {
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
    }
  };

  window.closeResultsModal = function () {
    document.getElementById('resultsModal').classList.add('hidden');
  };

  document.addEventListener("DOMContentLoaded", function () {
    injectAdaptiveKeyboard();
    injectResultsModal();
    window.addEventListener('click', initAudio, { once: true });
  });
})();