import {
auth,
db
}
from "./firebase-config.js";

import {
doc,
getDoc,
collection,
getDocs,
query,
where
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// DOM एलिमेंट्स सिलेक्शन
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const profilePhoto = document.getElementById("profilePhoto");
const testsTaken = document.getElementById("testsTaken");
const bestWpm = document.getElementById("bestWpm");
const recentTests = document.getElementById("recentTests");
const bestAccuracy = document.getElementById("bestAccuracy");
const totalStars = document.getElementById("totalStars");
const perfectRuns = document.getElementById("perfectRuns");
const bestStreakStat = document.getElementById("bestStreak");
const totalScore = document.getElementById("totalScore");
const logoutBtn = document.getElementById("logoutBtn");

/* =========================================================
   🔐 AUTH STATE & PROFILE DATA LOAD ENGINE
========================================================= */
onAuthStateChanged(auth, async (user)=>{

    if(!user){
        // 👈 जर युझर लॉगिन नसेल, तर त्याला होम पेजवर पाठवून लॉगिन पॉपअप ट्रिगर करू
        window.location.href = "index.html?action=login";
        return;
    }

    // १. बेसिक प्रोफाइल डेटा मॅपिंग
    userName.textContent = user.displayName || "TypeNest User";
    userEmail.textContent = user.email;

    if(user.photoURL){
        profilePhoto.src = user.photoURL;
    }

    // २. फायरबेस युझर डॉक्युमेंट फेचिंग
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if(userSnap.exists()){
        const data = userSnap.data();
        const stats = data.stats || {};

        // मूळ स्कोअरबोर्ड आणि स्टॅट्स अपडेट
        totalStars.textContent = stats.totalStars || 0;
        perfectRuns.textContent = stats.perfectRuns || 0;
        bestStreakStat.textContent = stats.bestStreak || 0;
        totalScore.textContent = stats.totalScore || 0;
        
        const home = data.progress?.home || 1;
        const toprow = data.progress?.toprow || 1;
        const bottom = data.progress?.bottomrow || 1;
        const words = data.progress?.words || 1;
        const numbers = data.progress?.numbers || 1;
        const advanced = data.progress?.advanced || 1;

        // 🏅 बॅजेस अनलॉक इंजिन (२०+ लेव्हल्स झाल्यावर हायलाईट)
        if(home >= 21){ document.getElementById("badgeHome").classList.add("badge-earned"); }
        if(bottom >= 21){ document.getElementById("badgeBottom").classList.add("badge-earned"); }
        if(words >= 21){ document.getElementById("badgeWords").classList.add("badge-earned"); }
        if(numbers >= 21){ document.getElementById("badgeNumbers").classList.add("badge-earned"); }
        if(advanced >= 21){ document.getElementById("badgeAdvanced").classList.add("badge-earned"); }
        
        // प्रोग्रेस टेक्स्ट मॅपिंग
        document.getElementById("homeProgress").textContent = (home - 1) + "/20";
        document.getElementById("bottomProgress").textContent = (bottom - 1) + "/20";
        document.getElementById("wordsProgress").textContent = (words - 1) + "/20";
        document.getElementById("numbersProgress").textContent = (numbers - 1) + "/20";
        document.getElementById("advancedProgress").textContent = (advanced - 1) + "/20";

        // प्रोग्रेस बार कॅल्क्युलेशन (एकूण १०० लेव्हल्स पैकी)
        const totalCompleted = (home - 1) + (toprow - 1) + (bottom - 1) + (words - 1) + (numbers - 1) + (advanced - 1);
        const overallProgress = Math.round((totalCompleted / 100) * 100);

        if(overallProgress >= 100){
            document.getElementById("badgeChampion").classList.add("badge-earned");
        }
                
        document.getElementById("progressText").textContent = overallProgress + "% Complete";
        document.getElementById("progressFill").style.width = overallProgress + "%";
        
        testsTaken.textContent = data.testsTaken || 0;
        bestWpm.textContent = data.bestWpm || 0;
        bestAccuracy.textContent = (data.bestAccuracy || 0) + "%";
    }

    /* =========================================================
       🏆 GLOBAL LEADERBOARD RANK CALCULATION
    ========================================================= */
    try {
        const allUsers = await getDocs(collection(db, "users"));
        let users = [];

        allUsers.forEach((doc)=>{
            users.push(doc.data());
        });

        users.sort(function(a, b){
            return (b.bestWpm || 0) - (a.bestWpm || 0);
        });

        let rank = users.findIndex(u => u.email === user.email);
        const userRankEl = document.getElementById("userRank");
        if (userRankEl) {
            userRankEl.textContent = "#" + (rank + 1);
        }
    } catch(err) {
        console.error("Leaderboard rank error:", err);
    }

    /* =========================================================
       📈 RECENT TYPING TESTS HISTORY DISPLAY
    ========================================================= */
    try {
        const historyQuery = query(collection(db, "history"), where("userId", "==", user.uid));
        const historySnap = await getDocs(historyQuery);
        let tests = [];

        historySnap.forEach((doc)=>{
            tests.push(doc.data());
        });

        tests.sort(function(a, b){
            return new Date(b.date) - new Date(a.date);
        });

        recentTests.innerHTML = "";

        tests.slice(0, 5).forEach(function(test, index){
            recentTests.innerHTML += `
            <div class="test-item" style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.02); color: #fff;">
                <span>Test #${tests.length - index}</span>
                <strong style="color: #2563eb;">${test.wpm} WPM</strong>
                <span style="color: #10b981;">${test.accuracy}%</span>
            </div>`;
        });

        if(tests.length === 0){
            recentTests.innerHTML = "<div style='color: #646669; padding: 10px;'>No tests found</div>";
        }
    } catch(err) {
        console.error("History fetch error:", err);
        recentTests.innerHTML = "<div style='color: #ef4444; padding: 10px;'>Failed to load tests</div>";
    }
    
});

/* =========================================================
   🚪 LOGOUT OPERATION
========================================================= */
if (logoutBtn) {
    logoutBtn.addEventListener("click", (e)=>{
        e.preventDefault();
        signOut(auth).then(()=>{
            localStorage.clear(); // लोकल स्टोरेज साफ करणे
            window.location.href = "index.html";
        });
    });
}
