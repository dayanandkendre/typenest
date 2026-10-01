// assets/js/layout.js - Clean Nav + Login Popup Modal Trigger
document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  // 1. Header with Desktop Nav + Mobile Hamburger
  const navbarHTML = `
  <header class="sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      
      <!-- Logo + Tagline -->
      <a href="index.html" class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
          <i class="fa-solid fa-keyboard text-white text-lg"></i>
        </div>
        <div>
          <span class="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
            TypeNest <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">ACADEMY</span>
          </span>
          <p class="text-[10px] text-slate-400 font-medium tracking-wide">Touch Typing, Drills & Certification</p>
        </div>
      </a>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/60 text-sm font-medium">
        <a href="index.html" class="px-3 py-1.5 rounded-lg transition flex items-center gap-2 ${currentPath === 'index.html' ? 'text-indigo-400 bg-slate-700/70 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/40'}">
          <i class="fa-solid fa-house text-xs"></i> Arena
        </a>
        <a href="learn.html" class="px-3 py-1.5 rounded-lg transition flex items-center gap-2 ${currentPath === 'learn.html' ? 'text-indigo-400 bg-slate-700/70 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/40'}">
          <i class="fa-solid fa-graduation-cap text-xs"></i> Lessons
        </a>
        <a href="tests.html" class="px-3 py-1.5 rounded-lg transition flex items-center gap-2 ${currentPath === 'tests.html' ? 'text-indigo-400 bg-slate-700/70 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/40'}">
          <i class="fa-solid fa-stopwatch text-xs"></i> Tests
        </a>
        <a href="courses.html" class="px-3 py-1.5 rounded-lg transition flex items-center gap-2 ${currentPath === 'courses.html' ? 'text-indigo-400 bg-slate-700/70 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/40'}">
          <i class="fa-solid fa-layer-group text-xs"></i> Courses
        </a>
        <a href="leaderboard.html" class="px-3 py-1.5 rounded-lg transition flex items-center gap-2 ${currentPath === 'leaderboard.html' ? 'text-indigo-400 bg-slate-700/70 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/40'}">
          <i class="fa-solid fa-trophy text-xs"></i> Leaderboard
        </a>
        <a href="certificate.html" class="px-3 py-1.5 rounded-lg transition flex items-center gap-2 ${currentPath === 'certificate.html' ? 'text-indigo-400 bg-slate-700/70 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/40'}">
          <i class="fa-solid fa-award text-xs"></i> Certificate
        </a>
        <a href="blog.html" class="px-3 py-1.5 rounded-lg transition flex items-center gap-2 ${currentPath === 'blog.html' ? 'text-indigo-400 bg-slate-700/70 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/40'}">
          <i class="fa-solid fa-newspaper text-xs"></i> Guides
        </a>
      </nav>

      <!-- Right Action Controls -->
      <div class="flex items-center gap-2.5">
        <button id="soundToggleBtn" onclick="toggleSound()" title="Toggle Keystroke Audio" class="hidden sm:flex p-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-indigo-500/50 text-indigo-400 hover:text-white transition items-center justify-center">
          <i id="soundIcon" class="fa-solid fa-volume-high text-sm"></i>
        </button>

        <!-- Smart Login / Profile Button -->
        <button id="loginBtn" class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-sm">
          <span>👤</span>
          <span id="userNavText">Login</span>
        </button>

        <!-- Hamburger Icon Button for Mobile -->
        <button id="mobileMenuToggle" class="md:hidden p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition">
          <i class="fa-solid fa-bars text-lg"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Slide-Down Menu -->
    <div id="mobileNavMenu" class="hidden md:hidden bg-[#0b0f19] border-b border-slate-800 px-4 py-4 space-y-2 text-sm shadow-2xl">
      <a href="index.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl ${currentPath === 'index.html' ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60'}">
        <i class="fa-solid fa-house text-xs w-4"></i> Typing Arena
      </a>
      <a href="learn.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl ${currentPath === 'learn.html' ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60'}">
        <i class="fa-solid fa-graduation-cap text-xs w-4"></i> Lessons Curriculum
      </a>
      <a href="tests.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl ${currentPath === 'tests.html' ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60'}">
        <i class="fa-solid fa-stopwatch text-xs w-4"></i> Speed Tests
      </a>
      <a href="courses.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl ${currentPath === 'courses.html' ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60'}">
        <i class="fa-solid fa-layer-group text-xs w-4"></i> Typing Courses
      </a>
      <a href="leaderboard.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl ${currentPath === 'leaderboard.html' ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60'}">
        <i class="fa-solid fa-trophy text-xs w-4"></i> Leaderboard Ranks
      </a>
      <a href="certificate.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl ${currentPath === 'certificate.html' ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60'}">
        <i class="fa-solid fa-award text-xs w-4"></i> Verified Certificate
      </a>
      <a href="blog.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl ${currentPath === 'blog.html' ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60'}">
        <i class="fa-solid fa-newspaper text-xs w-4"></i> Typing Guides & Tips
      </a>
      <button id="mobileLoginBtn" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs">
        <i class="fa-solid fa-user text-xs w-4"></i> <span id="mobileNavUserText">Login / Account</span>
      </button>
    </div>
  </header>

  <!-- Login Modal Popup -->
  <div id="loginModal" class="hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
    <div class="login-box bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl relative text-center">
      <button onclick="document.getElementById('loginModal').classList.add('hidden')" class="absolute top-4 right-4 text-slate-400 hover:text-white text-lg">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl mx-auto mb-3 border border-indigo-500/30">
        <i class="fa-solid fa-arrow-right-to-bracket"></i>
      </div>
      <h3 class="text-xl font-bold text-white">Sign In to TypeNest</h3>
      <p class="text-slate-400 text-xs mt-1 mb-5">Save your typing progress, stars & certificates</p>
      
      <!-- Google 1-Click Login -->
      <button id="googleLoginBtn" class="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs flex items-center justify-center gap-2.5 shadow-md transition">
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

  // 2. Footer
  const footerHTML = `
  <footer class="mt-auto border-t border-slate-800/80 bg-[#070b12] text-slate-400 text-xs font-sans selection:bg-indigo-500 selection:text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-8">
        
        <div class="col-span-2 space-y-3">
          <a href="index.html" class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
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
        </div>

        <div class="space-y-2">
          <h3 class="text-xs uppercase font-extrabold text-white tracking-wider">Practice & Drills</h3>
          <ul class="space-y-1.5 font-medium">
            <li><a href="index.html" class="hover:text-indigo-400 transition">Typing Arena</a></li>
            <li><a href="tests.html" class="hover:text-indigo-400 transition">Timed Speed Tests</a></li>
            <li><a href="number-typing-practice.html" class="hover:text-indigo-400 transition">Number Row Practice</a></li>
            <li><a href="punctuation-typing-practice.html" class="hover:text-indigo-400 transition">Punctuation Drills</a></li>
            <li><a href="difficult-words-typing-practice.html" class="hover:text-indigo-400 transition">Difficult Words</a></li>
          </ul>
        </div>

        <div class="space-y-2">
          <h3 class="text-xs uppercase font-extrabold text-white tracking-wider">Courses</h3>
          <ul class="space-y-1.5 font-medium">
            <li><a href="courses.html" class="hover:text-indigo-400 transition">All Courses Hub</a></li>
            <li><a href="beginner.html" class="hover:text-indigo-400 transition">Beginner Typing</a></li>
            <li><a href="speed-building.html" class="hover:text-indigo-400 transition">Speed Building</a></li>
            <li><a href="accuracy-mastery.html" class="hover:text-indigo-400 transition">Accuracy Mastery</a></li>
            <li><a href="advanced-typing.html" class="hover:text-indigo-400 transition">Advanced Technical</a></li>
          </ul>
        </div>

        <div class="space-y-2">
          <h3 class="text-xs uppercase font-extrabold text-white tracking-wider">Support & Trust</h3>
          <ul class="space-y-1.5 font-medium">
            <li><a href="certificate.html" class="hover:text-indigo-400 transition">Print Certificate</a></li>
            <li><a href="leaderboard.html" class="hover:text-indigo-400 transition">Global Leaderboard</a></li>
            <li><a href="blog.html" class="hover:text-indigo-400 transition">Guides & Tips</a></li>
            <li><a href="privacy.html" class="hover:text-indigo-400 transition">Privacy Policy</a></li>
            <li><a href="terms.html" class="hover:text-indigo-400 transition">Terms of Service</a></li>
          </ul>
        </div>

      </div>

      <div class="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
        <div>
          © 2026 TypeNest Academy. Developed by <strong class="text-slate-300 font-semibold">Dayanand Dinkar Kendre</strong>. All rights reserved.
        </div>
        <div class="flex items-center gap-4 font-medium">
          <a href="privacy.html" class="hover:text-slate-300 transition">Privacy</a>
          <a href="terms.html" class="hover:text-slate-300 transition">Terms</a>
          <a href="contact.html" class="hover:text-slate-300 transition">Support</a>
        </div>
      </div>
    </div>
  </footer>
  `;

  document.body.insertAdjacentHTML("afterbegin", navbarHTML);
  document.body.insertAdjacentHTML("beforeend", footerHTML);

  // Hamburger Toggle Listener
  const menuBtn = document.getElementById("mobileMenuToggle");
  const navMenu = document.getElementById("mobileNavMenu");
  if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
      navMenu.classList.toggle("hidden");
    });
  }
});
