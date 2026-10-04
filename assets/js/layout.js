// =============================================================================
// FILE: assets/js/layout.js
// PLATFORM: TypeNest Academy (typenest.in)
// FEATURES: Instant Theme Sync, Dynamic Navbar & Footer, Firebase Auth & Dropdown,
//           Social Branding Links, and Arcade Suite Routing
// =============================================================================

// -----------------------------------------------------------------------------
// SECTION 1: FIREBASE SDK IMPORTS
// -----------------------------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  signOut 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// -----------------------------------------------------------------------------
// SECTION 2: INSTANT ANTI-FOUC THEME CHECK (Zero Delay Execution)
// -----------------------------------------------------------------------------
(function () {
  const savedTheme = localStorage.getItem("tn_theme");
  if (savedTheme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }
})();

// -----------------------------------------------------------------------------
// SECTION 3: FIREBASE CLIENT INITIALIZATION
// -----------------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyAXzw_g1r7kvYC2d6_d4RqDOoTF_svAphc",
  authDomain: "typenext-5bd90.firebaseapp.com",
  projectId: "typenext-5bd90",
  storageBucket: "typenext-5bd90.firebasestorage.app",
  messagingSenderId: "848488048236",
  appId: "1:848488048236:web:a742a647977a48ca63da49",
  measurementId: "G-B5WGZM350T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// -----------------------------------------------------------------------------
// SECTION 4: DOM INITIALIZATION & INJECTION
// -----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const fullPath = window.location.pathname;

  // 4.1 INJECT GLOBAL LIGHT/DARK CSS OVERRIDES
  if (!document.getElementById("tn-theme-overrides")) {
    const styleEl = document.createElement("style");
    styleEl.id = "tn-theme-overrides";
    styleEl.innerHTML = `
      /* Light Mode Base Settings */
      html:not(.dark) body { background-color: #f8fafc !important; color: #0f172a !important; }

      /* Blog & Guide Headings & High Contrast Text */
      html:not(.dark) h1, 
      html:not(.dark) h2, 
      html:not(.dark) h3, 
      html:not(.dark) h4,
      html:not(.dark) .text-white { 
        color: #0f172a !important; 
      }
      
      /* Fix Grey Faded Text in Light Mode Cards */
      html:not(.dark) .text-slate-200,
      html:not(.dark) .text-slate-300 { 
        color: #1e293b !important; 
      }
      html:not(.dark) .text-slate-400 { 
        color: #334155 !important; 
      }
      html:not(.dark) .text-slate-500 { 
        color: #475569 !important; 
      }

      /* Cards & Containers in Light Mode */
      html:not(.dark) main div[class*="bg-[#0f172a]"], 
      html:not(.dark) main div[class*="bg-[#111827]"],
      html:not(.dark) main div[class*="bg-[#1e293b]"], 
      html:not(.dark) main div[class*="bg-slate-900"], 
      html:not(.dark) main div[class*="bg-slate-800"] { 
        background-color: #ffffff !important; 
        border-color: #e2e8f0 !important; 
        color: #0f172a !important; 
      }

      /* Fix Bottom CTA Banner Text & Background in Light Mode */
      html:not(.dark) div[class*="from-indigo-950"],
      html:not(.dark) div[class*="to-slate-900"],
      html:not(.dark) .bg-gradient-to-r,
      html:not(.dark) .bg-gradient-to-b {
        color: #0f172a !important;
      }
      html:not(.dark) div[class*="bg-gradient-to"] p {
        color: #334155 !important;
      }

      /* Secondary Buttons in Light Mode */
      html:not(.dark) a[class*="bg-slate-800"],
      html:not(.dark) button[class*="bg-slate-800"] {
        background-color: #f1f5f9 !important;
        color: #0f172a !important;
        border-color: #cbd5e1 !important;
      }

      /* Header & Footer Rules */
      html:not(.dark) #siteHeader { background-color: #ffffff !important; border-color: #e2e8f0 !important; }
      html:not(.dark) #siteHeader span, 
      html:not(.dark) #siteHeader a, 
      html:not(.dark) #siteHeader button { color: #0f172a !important; }
      html:not(.dark) #siteHeader .bg-slate-800, 
      html:not(.dark) #siteHeader .bg-slate-800\\/90, 
      html:not(.dark) #siteHeader .bg-slate-800\\/60 { background-color: #f1f5f9 !important; border-color: #cbd5e1 !important; }
      html:not(.dark) #mobileNavMenu, 
      html:not(.dark) #userDropdownMenu { background-color: #ffffff !important; border-color: #e2e8f0 !important; }
      html:not(.dark) #mobileNavMenu a, 
      html:not(.dark) #userDropdownMenu a, 
      html:not(.dark) #userDropdownMenu button { color: #334155 !important; }

      html:not(.dark) footer#siteFooter { background-color: #f8fafc !important; border-color: #e2e8f0 !important; color: #475569 !important; }
      html:not(.dark) footer#siteFooter div { background-color: transparent !important; box-shadow: none !important; border-color: #e2e8f0 !important; }
      html:not(.dark) footer#siteFooter h3, 
      html:not(.dark) footer#siteFooter strong { color: #0f172a !important; }
      html:not(.dark) footer#siteFooter a { color: #475569 !important; }
      html:not(.dark) footer#siteFooter a:hover { color: #4f46e5 !important; }
      html:not(.dark) footer#siteFooter p, 
      html:not(.dark) footer#siteFooter span { color: #64748b !important; }
    `;
    document.head.appendChild(styleEl);
  }

  // 4.2 DETECT TYPING PAGES (Includes practice.html for Sound Button)
  const typingPages = [
    "index.html", 
    "tests.html", 
    "practice.html", 
    "number-typing-practice.html", 
    "punctuation-typing-practice.html", 
    "difficult-words-typing-practice.html", 
    "beginner.html", 
    "speed-building.html", 
    "accuracy-mastery.html", 
    "advanced-typing.html"
  ];
  const isTypingPage = typingPages.includes(currentPath) || fullPath.includes("/vocab/practice.html");

  // 4.3 ROUTE ACTIVE STATE DETECTORS (Including Master Arcade Hub & Games)
  const isVocabActive = fullPath.includes("/vocab/") && !fullPath.includes("/vocab-word-defender/");
  const isArcadeActive = fullPath.includes("/arcade/") || fullPath.includes("/vocab-word-defender/") || currentPath.includes("arcade");
  const isLearnActive = fullPath.includes("/learn/") || currentPath.includes("row") || currentPath.includes("wordslevel") || currentPath.includes("numberslevel") || currentPath.includes("advancedlevel");

  // 4.4 THEME TOGGLE HANDLER FUNCTION
  const applyTheme = (theme) => {
    const isDark = theme === "dark";
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    const themeIcon = document.getElementById("themeIcon");
    if (themeIcon) {
      themeIcon.className = isDark ? "fa-solid fa-sun text-amber-400 text-base" : "fa-solid fa-moon text-indigo-400 text-base";
    }
  };

  const isCurrentDark = document.documentElement.classList.contains("dark");

  // ---------------------------------------------------------------------------
  // SECTION 5: HEADER COMPONENT TEMPLATE (Clean 7-Item Nav with 100-Lvl Learn)
  // ---------------------------------------------------------------------------
  const navbarHTML = `
  <header id="siteHeader" class="sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
      
      <!-- Logo + Tagline -->
      <a href="/index.html" class="flex items-center gap-2.5 sm:gap-3 group py-1 flex-shrink-0">
        <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
          <i class="fa-solid fa-keyboard text-white text-base sm:text-lg"></i>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xl sm:text-2xl font-bold tracking-tight text-white leading-none">TypeNest</span>
          <span class="hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">ACADEMY</span>
        </div>
      </a>

      <!-- Desktop Nav (Clean, No-Overflow Layout) -->
      <nav class="hidden md:flex items-center gap-1 bg-slate-800/60 p-1.5 rounded-2xl border border-slate-700/60 text-xs sm:text-sm font-medium">
        <a href="/index.html" class="px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${currentPath === 'index.html' && !isVocabActive && !isArcadeActive && !fullPath.includes('/curriculum/') ? 'text-indigo-400 bg-slate-700/70 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/40'}">
          <i class="fa-solid fa-house text-xs"></i> Arena
        </a>
        <a href="/curriculum/index.html" class="px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${fullPath.includes('/curriculum/') ? 'text-indigo-400 bg-slate-700/70 shadow-sm font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-700/40'}">
          <i class="fa-solid fa-graduation-cap text-xs text-indigo-400"></i> Learn
        </a>
        <a href="/arcade/index.html" class="px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${isArcadeActive ? 'text-amber-400 bg-slate-700/70 shadow-sm font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-700/40'}">
          <i class="fa-solid fa-gamepad text-xs text-amber-400"></i> Arcade
        </a>
        <a href="/vocab/index.html" class="px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${isVocabActive ? 'text-indigo-400 bg-slate-700/70 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/40'}">
          <i class="fa-solid fa-spell-check text-xs"></i> Vocab
        </a>
        <a href="/learn/learn.html" class="px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${isLearnActive && !fullPath.includes('/curriculum/') ? 'text-indigo-400 bg-slate-700/70 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/40'}">
          <i class="fa-solid fa-bullseye text-xs"></i> Drills
        </a>
        <a href="/tests.html" class="px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${currentPath === 'tests.html' ? 'text-indigo-400 bg-slate-700/70 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/40'}">
          <i class="fa-solid fa-stopwatch text-xs"></i> Tests
        </a>
        <a href="/courses.html" class="px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${currentPath === 'courses.html' ? 'text-indigo-400 bg-slate-700/70 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/40'}">
          <i class="fa-solid fa-layer-group text-xs"></i> Courses
        </a>
        <a href="/blog.html" class="px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${currentPath === 'blog.html' ? 'text-indigo-400 bg-slate-700/70 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/40'}">
          <i class="fa-solid fa-newspaper text-xs"></i> Guides
        </a>
      </nav>

      <!-- Right Action Controls (Sound, Theme, Auth) -->
      <div class="flex items-center gap-2">
        ${isTypingPage ? `
        <button id="soundToggleBtn" onclick="toggleSound()" title="Toggle Keystroke Audio" class="hidden sm:flex w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 hover:border-indigo-500/50 text-indigo-400 hover:text-white transition items-center justify-center shadow-sm">
          <i id="soundIcon" class="fa-solid fa-volume-high text-sm"></i>
        </button>
        ` : ''}

        <button id="themeToggleBtn" title="Toggle Theme" class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-indigo-500/50 text-slate-300 hover:text-white transition flex items-center justify-center shadow-sm flex-shrink-0">
          <i id="themeIcon" class="fa-solid ${isCurrentDark ? 'fa-sun text-amber-400' : 'fa-moon text-indigo-400'} text-base"></i>
        </button>

        <!-- User Desktop Button with Dropdown Container -->
        <div class="relative hidden sm:block">
          <button id="loginBtn" class="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/20">
            <span>👤</span>
            <span id="userNavText">Login</span>
          </button>

          <!-- User Logged-In Dropdown Menu -->
          <div id="userDropdownMenu" class="hidden absolute right-0 mt-2 w-48 bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 text-xs">
            <a href="/profile.html" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition">
              <i class="fa-solid fa-user-astronaut text-indigo-400"></i> My Profile
            </a>
            <a href="/leaderboard.html" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition">
              <i class="fa-solid fa-trophy text-indigo-400"></i> Leaderboard
            </a>
            <a href="/certificate.html" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition">
              <i class="fa-solid fa-award text-amber-400"></i> Certificates
            </a>
            <div class="h-px bg-slate-800 my-1"></div>
            <button id="logoutBtn" class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition text-left">
              <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
            </button>
          </div>
        </div>

        <!-- Mobile Hamburger Button -->
        <button id="mobileMenuToggle" class="md:hidden w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700 transition flex items-center justify-center shadow-sm flex-shrink-0">
          <i class="fa-solid fa-bars text-lg"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Slide-Down Menu -->
    <div id="mobileNavMenu" class="hidden md:hidden bg-[#0b0f19] border-b border-slate-800 px-5 py-5 space-y-2 text-base shadow-2xl">
      <a href="/index.html" class="flex items-center gap-3.5 px-4 py-3 rounded-xl ${currentPath === 'index.html' && !isVocabActive && !isArcadeActive && !fullPath.includes('/curriculum/') ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60'}">
        <i class="fa-solid fa-house text-sm w-5"></i> Typing Arena
      </a>
      <a href="/curriculum/index.html" class="flex items-center gap-3.5 px-4 py-3 rounded-xl ${fullPath.includes('/curriculum/') ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60'}">
        <i class="fa-solid fa-graduation-cap text-sm w-5 text-indigo-400"></i> 100-Level Learn
      </a>
      <a href="/arcade/index.html" class="flex items-center gap-3.5 px-4 py-3 rounded-xl ${isArcadeActive ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60'}">
        <i class="fa-solid fa-gamepad text-sm w-5 text-amber-400"></i> Arcade Games Hub
      </a>
      <a href="/vocab/index.html" class="flex items-center gap-3.5 px-4 py-3 rounded-xl ${isVocabActive ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60'}">
        <i class="fa-solid fa-spell-check text-sm w-5"></i> Learn Vocab
      </a>
      <a href="/learn/learn.html" class="flex items-center gap-3.5 px-4 py-3 rounded-xl ${isLearnActive && !fullPath.includes('/curriculum/') ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60'}">
        <i class="fa-solid fa-bullseye text-sm w-5"></i> Row Practice Drills
      </a>
      <a href="/tests.html" class="flex items-center gap-3.5 px-4 py-3 rounded-xl ${currentPath === 'tests.html' ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60'}">
        <i class="fa-solid fa-stopwatch text-sm w-5"></i> Speed Tests
      </a>
      <a href="/courses.html" class="flex items-center gap-3.5 px-4 py-3 rounded-xl ${currentPath === 'courses.html' ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60'}">
        <i class="fa-solid fa-layer-group text-sm w-5"></i> Typing Courses
      </a>
      <a href="/leaderboard.html" class="flex items-center gap-3.5 px-4 py-3 rounded-xl ${currentPath === 'leaderboard.html' ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60'}">
        <i class="fa-solid fa-trophy text-sm w-5"></i> Leaderboard Ranks
      </a>
      <a href="/certificate.html" class="flex items-center gap-3.5 px-4 py-3 rounded-xl ${currentPath === 'certificate.html' ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60'}">
        <i class="fa-solid fa-award text-sm w-5"></i> Verified Certificate
      </a>
      <a href="/blog.html" class="flex items-center gap-3.5 px-4 py-3 rounded-xl ${currentPath === 'blog.html' ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60'}">
        <i class="fa-solid fa-newspaper text-sm w-5"></i> Typing Guides & Tips
      </a>

      <!-- Mobile User / Logout Section -->
      <div class="pt-3 border-t border-slate-800/80 mt-3 space-y-2">
        <button id="mobileLoginBtn" class="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition">
          <i class="fa-solid fa-user text-xs"></i> 
          <span id="mobileNavUserText">Login / Account</span>
        </button>
        <button id="mobileLogoutBtn" class="hidden w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs border border-rose-500/20 transition">
          <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout Account
        </button>
      </div>
    </div>
  </header>

  <!-- Login Modal Popup -->
  <div id="loginModal" class="hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
    <div class="login-box bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl relative text-center">
      <button id="closeLoginModalBtn" class="absolute top-4 right-4 text-slate-400 hover:text-white text-lg">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl mx-auto mb-3 border border-indigo-500/30">
        <i class="fa-solid fa-arrow-right-to-bracket"></i>
      </div>
      <h3 class="text-xl font-bold text-white">Sign In to TypeNest</h3>
      <p class="text-slate-400 text-xs mt-1 mb-5">Save your typing progress, stars & certificates</p>
      
      <button id="googleLoginBtn" class="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs flex items-center justify-center gap-2.5 shadow-md transition cursor-pointer">
        <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
        Continue with Google
      </button>

      <div class="my-4 flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold">
        <div class="h-px bg-slate-800 flex-1"></div>
        <span>or email</span>
        <div class="h-px bg-slate-800 flex-1"></div>
      </div>

      <div class="space-y-2.5 text-left">
        <input type="email" id="email" placeholder="Email address" class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500">
        <input type="password" id="password" placeholder="Password" class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500">
        <button class="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition">Sign In</button>
      </div>
    </div>
  </div>
  `;

  // ---------------------------------------------------------------------------
  // SECTION 6: FOOTER COMPONENT TEMPLATE (Updated with Arcade & Social Links)
  // ---------------------------------------------------------------------------
  const footerHTML = `
  <footer id="siteFooter" class="mt-auto border-t border-slate-800/80 bg-[#070b12] text-slate-400 text-xs font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
        
        <div class="sm:col-span-2 space-y-4">
          <a href="/index.html" class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <i class="fa-solid fa-keyboard text-white text-base"></i>
            </div>
            <span class="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              TypeNest <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">ACADEMY</span>
            </span>
          </a>
          <p class="text-slate-400 text-xs leading-relaxed max-w-sm">
            Empowering students, developers, and exam candidates with professional touch typing muscle memory, real-time WPM analytics, and free certified credentials.
          </p>
          
          <div class="flex items-center gap-3 pt-1">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> 100% Free Platform
            </span>
            <span class="text-slate-600">•</span>
            <span class="text-slate-500 text-[11px] font-mono">Pune, Maharashtra</span>
          </div>

          <!-- Social Media Follow Links -->
          <div class="flex items-center gap-3 pt-2">
            <span class="text-[11px] font-semibold text-slate-400">Follow Us:</span>
            <a href="https://www.facebook.com/profile.php?id=61595099519418" target="_blank" rel="noopener noreferrer" title="Follow TypeNest on Facebook" class="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-200">
              <i class="fa-brands fa-facebook-f text-sm"></i>
            </a>
            <a href="https://www.instagram.com/typenestacademy/" target="_blank" rel="noopener noreferrer" title="Follow TypeNest on Instagram" class="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:border-pink-500 transition-all duration-200">
              <i class="fa-brands fa-instagram text-sm"></i>
            </a>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xs uppercase font-extrabold text-white tracking-wider">Practice & Drills</h3>
          <ul class="space-y-2 font-medium">
            <li><a href="/index.html" class="hover:text-indigo-400 transition">Typing Arena</a></li>
            <li><a href="/arcade/index.html" class="hover:text-amber-300 transition font-semibold text-amber-400 flex items-center gap-1.5"><i class="fa-solid fa-gamepad text-xs"></i> Arcade Suite (5 Games)</a></li>
            <li><a href="/vocab-word-defender/index.html" class="hover:text-indigo-400 transition">Vocab Word Defender</a></li>
            <li><a href="/vocab/index.html" class="hover:text-indigo-400 transition font-semibold text-indigo-300">Learn Vocab Game</a></li>
            <li><a href="/learn/learn.html" class="hover:text-indigo-400 transition">20-Level Drills</a></li>
            <li><a href="/tests.html" class="hover:text-indigo-400 transition">Timed Speed Tests</a></li>
            <li><a href="/number-typing-practice.html" class="hover:text-indigo-400 transition">Number Row Practice</a></li>
            <li><a href="/difficult-words-typing-practice.html" class="hover:text-indigo-400 transition">Difficult Words</a></li>
          </ul>
        </div>

        <div class="space-y-3">
          <h3 class="text-xs uppercase font-extrabold text-white tracking-wider">Courses</h3>
          <ul class="space-y-2 font-medium">
            <li><a href="/courses.html" class="hover:text-indigo-400 transition">All Courses Hub</a></li>
            <li><a href="/beginner.html" class="hover:text-indigo-400 transition">Beginner Typing</a></li>
            <li><a href="/speed-building.html" class="hover:text-indigo-400 transition">Speed Building</a></li>
            <li><a href="/accuracy-mastery.html" class="hover:text-indigo-400 transition">Accuracy Mastery</a></li>
            <li><a href="/advanced-typing.html" class="hover:text-indigo-400 transition">Advanced Technical</a></li>
          </ul>
        </div>

        <div class="space-y-3">
          <h3 class="text-xs uppercase font-extrabold text-white tracking-wider">Support & Trust</h3>
          <ul class="space-y-2 font-medium">
            <li><a href="/certificate.html" class="hover:text-indigo-400 transition">Print Certificate</a></li>
            <li><a href="/leaderboard.html" class="hover:text-indigo-400 transition">Global Leaderboard</a></li>
            <li><a href="/blog.html" class="hover:text-indigo-400 transition">Guides & Tips</a></li>
            <li><a href="/privacy.html" class="hover:text-indigo-400 transition">Privacy Policy</a></li>
            <li><a href="/terms.html" class="hover:text-indigo-400 transition">Terms of Service</a></li>
          </ul>
        </div>

      </div>

      <div class="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 text-center sm:text-left">
        <div>
          © 2026 TypeNest Academy. Developed by <strong class="text-slate-300 font-semibold">Dayanand Dinkar Kendre</strong>. All rights reserved.
        </div>
        <div class="flex items-center justify-center gap-4 font-medium">
          <a href="/privacy.html" class="hover:text-slate-300 transition">Privacy</a>
          <a href="/terms.html" class="hover:text-slate-300 transition">Terms</a>
          <a href="/contact.html" class="hover:text-slate-300 transition">Contact & Support</a>
          <a href="/about.html" class="hover:text-slate-300 transition">About</a>
        </div>
      </div>
    </div>
  </footer>
  `;

  // ---------------------------------------------------------------------------
  // SECTION 7: INJECT HEADER AND FOOTER INTO DOM
  // ---------------------------------------------------------------------------
  document.body.insertAdjacentHTML("afterbegin", navbarHTML);
  document.body.insertAdjacentHTML("beforeend", footerHTML);

  // ---------------------------------------------------------------------------
  // SECTION 8: UI EVENT LISTENERS (Menu, Theme, Modals)
  // ---------------------------------------------------------------------------
  const menuBtn = document.getElementById("mobileMenuToggle");
  const navMenu = document.getElementById("mobileNavMenu");
  const userDropdown = document.getElementById("userDropdownMenu");

  // 8.1 MOBILE HAMBURGER MENU LISTENER
  if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", () => {
      if (!navMenu.classList.contains("hidden")) {
        navMenu.classList.add("hidden");
      }
      if (userDropdown && !userDropdown.classList.contains("hidden")) {
        userDropdown.classList.add("hidden");
      }
    });
  }

  // 8.2 THEME TOGGLE BUTTON LISTENER
  const themeBtn = document.getElementById("themeToggleBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const isCurrentlyDark = document.documentElement.classList.contains("dark");
      const targetTheme = isCurrentlyDark ? "light" : "dark";
      localStorage.setItem("tn_theme", targetTheme);
      applyTheme(targetTheme);
    });
  }

  // 8.3 LOGIN MODAL CONTROLS
  const loginBtn = document.getElementById("loginBtn");
  const mobileLoginBtn = document.getElementById("mobileLoginBtn");
  const loginModal = document.getElementById("loginModal");
  const closeLoginModalBtn = document.getElementById("closeLoginModalBtn");

  const openLoginModal = () => {
    if (loginModal) {
      loginModal.classList.remove("hidden");
      if (navMenu && !navMenu.classList.contains("hidden")) {
        navMenu.classList.add("hidden");
      }
    }
  };

  if (closeLoginModalBtn && loginModal) {
    closeLoginModalBtn.addEventListener("click", () => {
      loginModal.classList.add("hidden");
    });
  }

  // 8.4 GOOGLE LOGIN POPUP EVENT
  const googleBtn = document.getElementById("googleLoginBtn");
  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            displayName: user.displayName || "Typist",
            email: user.email,
            photoURL: user.photoURL || "",
            topWpm: 0,
            avgAcc: 100,
            testsCompleted: 0,
            createdAt: serverTimestamp()
          });
        }
        if (loginModal) loginModal.classList.add("hidden");
      } catch (error) {
        console.error("Google Sign-In Error:", error);
        alert("Sign-in failed. Please try again.");
      }
    });
  }

  // ---------------------------------------------------------------------------
  // SECTION 9: LOGOUT LOGIC (Auth + LocalStorage Flush)
  // ---------------------------------------------------------------------------
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("tn_uid");
      localStorage.removeItem("tn_username");
      localStorage.removeItem("tn_photo");
      if (userDropdown) userDropdown.classList.add("hidden");
      window.location.reload();
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  document.getElementById("logoutBtn")?.addEventListener("click", handleLogout);
  document.getElementById("mobileLogoutBtn")?.addEventListener("click", handleLogout);

  // ---------------------------------------------------------------------------
  // SECTION 10: FIREBASE AUTH STATE LISTENER (UI Synchronization)
  // ---------------------------------------------------------------------------
  onAuthStateChanged(auth, (user) => {
    const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");

    if (user) {
      const displayName = user.displayName || user.email.split("@")[0];
      const avatarHTML = user.photoURL 
        ? `<img src="${user.photoURL}" class="w-5 h-5 rounded-full border border-indigo-300 object-cover">`
        : `<span>👤</span>`;

      // Logged-in Desktop: Open Dropdown on click
      if (loginBtn) {
        loginBtn.innerHTML = `${avatarHTML}<span>${displayName}</span> <i class="fa-solid fa-chevron-down text-[10px] ml-0.5"></i>`;
        loginBtn.onclick = (e) => {
          e.stopPropagation();
          if (userDropdown) userDropdown.classList.toggle("hidden");
        };
      }

      // Logged-in Mobile: Direct to profile, show logout button
      if (mobileLoginBtn) {
        mobileLoginBtn.innerHTML = `${avatarHTML}<span>${displayName} (Profile)</span>`;
        mobileLoginBtn.onclick = () => window.location.href = "/profile.html";
      }
      if (mobileLogoutBtn) {
        mobileLogoutBtn.classList.remove("hidden");
      }

      localStorage.setItem("tn_username", displayName);
      localStorage.setItem("tn_uid", user.uid);
      if (user.photoURL) localStorage.setItem("tn_photo", user.photoURL);
    } else {
      // Logged-out State
      if (loginBtn) {
        loginBtn.innerHTML = `<span>👤</span><span id="userNavText">Login</span>`;
        loginBtn.onclick = openLoginModal;
      }
      if (mobileLoginBtn) {
        mobileLoginBtn.innerHTML = `<i class="fa-solid fa-user text-xs"></i><span id="mobileNavUserText">Login / Account</span>`;
        mobileLoginBtn.onclick = openLoginModal;
      }
      if (mobileLogoutBtn) {
        mobileLogoutBtn.classList.add("hidden");
      }
      if (userDropdown) {
        userDropdown.classList.add("hidden");
      }
      localStorage.removeItem("tn_uid");
    }
  });
});
