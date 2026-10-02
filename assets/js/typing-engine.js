// assets/js/typing-engine.js - Adaptive Desktop Engine, Ultra Analytics & Audio-Fixed Engine
(function () {
  let audioCtx = null;
  let isSoundEnabled = true;

  // Audio Context Instant Initialization & Auto-Resume
  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playKeyClickSound() {
    if (!isSoundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450 + Math.random() * 80, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
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
    if (!audioCtx) return;

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

  // Auto-inject Keyboard on Desktop & Notice Card on Mobile
  function injectAdaptiveKeyboard() {
    const keyboardContainer = document.getElementById('keyboardWrapper');
    if (!keyboardContainer) return;

    keyboardContainer.innerHTML = `
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
          <div class="flex justify-center gap-1.5">
            <div class="key-cap w-16 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-[10px]">Ctrl</div>
            <div class="key-cap w-14 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-[10px]">Alt</div>
            <div class="key-cap w-72 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-xs tracking-wider font-semibold" data-key=" ">SPACEBAR</div>
            <div class="key-cap w-14 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-[10px]">Alt</div>
            <div class="key-cap w-16 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-[10px]">Ctrl</div>
          </div>
        </div>
      </div>

      <!-- Mobile Recommendation Notice -->
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

  // Keydown Engine with Audio Resume Guarantee
  window.addEventListener('keydown', function (e) {
    initAudio();

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

  // FIREBASE AUTO SAVE PROGRESS (Leaderboard + Profile Sync)
  async function saveProgressToFirebase(finalWPM, finalAcc, netWPM, totalTypedCount, errorCount) {
    const uid = localStorage.getItem("tn_uid");
    const username = localStorage.getItem("tn_username") || "Typist";
    const photoURL = localStorage.getItem("tn_photo") || "";

    localStorage.setItem("tn_last_wpm", finalWPM);
    localStorage.setItem("tn_last_acc", finalAcc);

    if (!uid) return;

    try {
      const { initializeApp, getApps } = await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js");
      const { getFirestore, doc, getDoc, setDoc, updateDoc, collection, addDoc, serverTimestamp } = 
        await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js");

      const firebaseConfig = {
        apiKey: "AIzaSyAXzw_g1r7kvYC2d6_d4RqDOoTF_svAphc",
        authDomain: "typenext-5bd90.firebaseapp.com",
        projectId: "typenext-5bd90",
        storageBucket: "typenext-5bd90.firebasestorage.app",
        messagingSenderId: "848488048236",
        appId: "1:848488048236:web:a742a647977a48ca63da49",
        measurementId: "G-B5WGZM350T"
      };

      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      const db = getFirestore(app);

      // 1. Leaderboard Document Update
      const leaderRef = doc(db, "leaderboard", uid);
      const leaderSnap = await getDoc(leaderRef);
      const prevWpm = leaderSnap.exists() ? (leaderSnap.data().wpm || 0) : 0;

      if (finalWPM >= prevWpm) {
        await setDoc(leaderRef, {
          name: username,
          wpm: finalWPM,
          accuracy: finalAcc,
          preset: durationSeconds > 0 ? `${durationSeconds / 60}m Sprint` : "Arena Challenge",
          photoURL: photoURL,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }

      // 2. User Aggregate Stats & History Log
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const uData = userSnap.data();
        const tests = (uData.testsCompleted || 0) + 1;
        const topWpm = Math.max(uData.topWpm || 0, finalWPM);
        const prevAccSum = (uData.avgAcc || 100) * (uData.testsCompleted || 0);
        const newAvgAcc = Math.round((prevAccSum + finalAcc) / tests);

        await updateDoc(userRef, {
          topWpm: topWpm,
          avgAcc: newAvgAcc,
          testsCompleted: tests,
          lastActive: serverTimestamp()
        });

        // 3. User Recent Session Log
        await addDoc(collection(db, "users", uid, "sessions"), {
          wpm: finalWPM,
          netWpm: netWPM,
          accuracy: finalAcc,
          chars: totalTypedCount,
          errors: errorCount,
          preset: durationSeconds > 0 ? `${durationSeconds / 60}m Test` : "Arena Challenge",
          createdAt: serverTimestamp()
        });
      }
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

    const grossWPM = Math.round((totalTypedCount / 5) / elapsedMins);
    const finalWPM = Math.round((correctCount / 5) / elapsedMins);
    const finalAcc = totalTypedCount > 0 ? Math.round((correctCount / totalTypedCount) * 100) : 100;
    const netWPM = Math.max(0, Math.round(finalWPM - (errorCount / elapsedMins)));

    saveProgressToFirebase(finalWPM, finalAcc, netWPM, totalTypedCount, errorCount);

    showResultsModal({
      wpm: finalWPM,
      grossWpm: grossWPM,
      netWpm: netWPM,
      accuracy: finalAcc,
      totalChars: totalTypedCount,
      correctChars: correctCount,
      errors: errorCount,
      timeTaken: Math.round(elapsedMins * 60)
    });
  }

  // Results Modal Component with Precise Non-Misleading Certificate Language
  function injectResultsModal() {
    const modalHTML = `
    <div id="resultsModal" class="hidden fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div class="bg-gradient-to-b from-[#111827] to-[#0b0f19] border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        
        <!-- Header & Tier Badge -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl border border-indigo-500/30">
              <i class="fa-solid fa-chart-line"></i>
            </div>
            <div>
              <h3 class="text-xl font-black text-white tracking-tight">Performance Summary</h3>
              <p class="text-slate-400 text-xs">Standard Speed & Accuracy Breakdown</p>
            </div>
          </div>
          <span id="modalTierBadge" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border">
            Novice
          </span>
        </div>

        <!-- Hero Stats (WPM & Accuracy) -->
        <div class="grid grid-cols-2 gap-3.5 my-5">
          <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 text-center relative overflow-hidden">
            <span class="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Net Speed (WPM)</span>
            <div id="modalWPM" class="text-4xl font-black text-indigo-400 font-mono mt-1">0</div>
            <span class="text-[10px] text-slate-500">Gross: <span id="modalGrossWPM" class="text-slate-300">0</span></span>
          </div>
          <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 text-center relative overflow-hidden">
            <span class="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Accuracy</span>
            <div id="modalAccuracy" class="text-4xl font-black text-emerald-400 font-mono mt-1">0%</div>
            <span class="text-[10px] text-slate-500">Errors: <span id="modalErrors" class="text-rose-400 font-semibold">0</span></span>
          </div>
        </div>

        <!-- 4 Sub-Metrics Grid -->
        <div class="grid grid-cols-4 gap-2 mb-6 text-center">
          <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span class="text-[10px] text-slate-400 block font-medium">Characters</span>
            <span id="modalChars" class="text-sm font-bold text-white font-mono">0</span>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span class="text-[10px] text-slate-400 block font-medium">Correct</span>
            <span id="modalCorrectChars" class="text-sm font-bold text-emerald-400 font-mono">0</span>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span class="text-[10px] text-slate-400 block font-medium">Time</span>
            <span id="modalTime" class="text-sm font-bold text-slate-300 font-mono">60s</span>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span class="text-[10px] text-slate-400 block font-medium">Rating</span>
            <span id="modalRating" class="text-sm font-bold text-amber-400 font-mono">★★☆☆☆</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-2.5">
          <div class="flex gap-2.5">
            <button onclick="closeResultsModal(); if(window.resetCurrentTest) window.resetCurrentTest();" class="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25">
              <i class="fa-solid fa-rotate-right"></i> Try Again (Esc)
            </button>
            <a href="leaderboard.html" class="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center gap-1.5">
              <i class="fa-solid fa-trophy text-amber-400"></i> Board
            </a>
          </div>
          <!-- Neutral Non-Misleading Certificate Action -->
          <a href="certificate.html" class="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs border border-slate-800 transition flex items-center justify-center gap-2">
            <i class="fa-solid fa-award text-amber-400"></i> View TypeNest Certificate &rarr;
          </a>
        </div>

      </div>
    </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  function showResultsModal(stats) {
    document.getElementById('modalWPM').innerText = stats.wpm;
    document.getElementById('modalGrossWPM').innerText = stats.grossWpm;
    document.getElementById('modalAccuracy').innerText = stats.accuracy + '%';
    document.getElementById('modalErrors').innerText = stats.errors;
    document.getElementById('modalChars').innerText = stats.totalChars;
    document.getElementById('modalCorrectChars').innerText = stats.correctChars;
    document.getElementById('modalTime').innerText = `${stats.timeTaken}s`;

    const tierBadge = document.getElementById('modalTierBadge');
    const ratingEl = document.getElementById('modalRating');

    if (stats.wpm >= 100) {
      tierBadge.innerText = 'Grandmaster';
      tierBadge.className = 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-purple-500/20 text-purple-300 border-purple-500/40';
      ratingEl.innerText = '★★★★★';
    } else if (stats.wpm >= 80) {
      tierBadge.innerText = 'Master';
      tierBadge.className = 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-amber-500/20 text-amber-300 border-amber-500/40';
      ratingEl.innerText = '★★★★☆';
    } else if (stats.wpm >= 60) {
      tierBadge.innerText = 'Professional';
      tierBadge.className = 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      ratingEl.innerText = '★★★☆☆';
    } else if (stats.wpm >= 40) {
      tierBadge.innerText = 'Intermediate';
      tierBadge.className = 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      ratingEl.innerText = '★★☆☆☆';
    } else {
      tierBadge.innerText = 'Novice';
      tierBadge.className = 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-slate-700/40 text-slate-300 border-slate-600/50';
      ratingEl.innerText = '★☆☆☆☆';
    }

    document.getElementById('resultsModal').classList.remove('hidden');

    if (typeof confetti === 'function' && stats.accuracy >= 90) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  }

  window.closeResultsModal = function () {
    document.getElementById('resultsModal').classList.add('hidden');
  };

  document.addEventListener("DOMContentLoaded", function () {
    injectAdaptiveKeyboard();
    injectResultsModal();

    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('touchstart', initAudio, { once: true });
    window.addEventListener('keydown', initAudio, { once: true });
  });
})();
