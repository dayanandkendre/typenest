// TypeNest Master Ultra-Premium Footer Component
document.addEventListener("DOMContentLoaded", function () {
  const footerHTML = `
  <footer class="mt-auto border-t border-slate-800/80 bg-[#070b12] text-slate-400 text-xs font-sans selection:bg-indigo-500 selection:text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        
        <!-- Brand Column -->
        <div class="lg:col-span-2 space-y-4">
          <a href="index.html" class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <i class="fa-solid fa-keyboard text-white text-lg"></i>
            </div>
            <span class="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              TypeNest <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">ACADEMY</span>
            </span>
          </a>
          <p class="text-slate-400 text-xs leading-relaxed max-w-sm">
            Empowering students, developers, and government exam aspirants with professional touch typing muscle memory, real-time WPM analytics, and free certified credentials.
          </p>
          <div class="flex items-center gap-3 pt-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> 100% Free Platform
            </span>
            <span class="text-slate-600">•</span>
            <span class="text-slate-500 text-[11px] font-mono">Pune, Maharashtra</span>
          </div>
        </div>

        <!-- Quick Practice Links -->
        <div class="space-y-3">
          <h3 class="text-xs uppercase font-extrabold text-white tracking-wider">Practice & Drills</h3>
          <ul class="space-y-2 font-medium">
            <li><a href="index.html" class="hover:text-indigo-400 transition">Typing Arena</a></li>
            <li><a href="tests.html" class="hover:text-indigo-400 transition">Timed Speed Tests</a></li>
            <li><a href="number-typing-practice.html" class="hover:text-indigo-400 transition">Number Row Practice</a></li>
            <li><a href="punctuation-typing-practice.html" class="hover:text-indigo-400 transition">Punctuation Drills</a></li>
            <li><a href="difficult-words-typing-practice.html" class="hover:text-indigo-400 transition">Difficult Words</a></li>
          </ul>
        </div>

        <!-- Courses & Curriculum -->
        <div class="space-y-3">
          <h3 class="text-xs uppercase font-extrabold text-white tracking-wider">Courses & Training</h3>
          <ul class="space-y-2 font-medium">
            <li><a href="courses.html" class="hover:text-indigo-400 transition">All Courses Hub</a></li>
            <li><a href="beginner.html" class="hover:text-indigo-400 transition">Beginner Typing (Home Row)</a></li>
            <li><a href="speed-building.html" class="hover:text-indigo-400 transition">Speed Building (Burst Drills)</a></li>
            <li><a href="accuracy-mastery.html" class="hover:text-indigo-400 transition">Accuracy Mastery</a></li>
            <li><a href="advanced-typing.html" class="hover:text-indigo-400 transition">Advanced Technical Typing</a></li>
          </ul>
        </div>

        <!-- Resources & Legal -->
        <div class="space-y-3">
          <h3 class="text-xs uppercase font-extrabold text-white tracking-wider">Support & Trust</h3>
          <ul class="space-y-2 font-medium">
            <li><a href="certificate.html" class="hover:text-indigo-400 transition">Print Certificate</a></li>
            <li><a href="leaderboard.html" class="hover:text-indigo-400 transition">Global Leaderboard</a></li>
            <li><a href="blog.html" class="hover:text-indigo-400 transition">Guides & Tips</a></li>
            <li><a href="contact.html" class="hover:text-indigo-400 transition">Contact Us</a></li>
            <li><a href="faq.html" class="hover:text-indigo-400 transition">FAQ</a></li>
            <li><a href="privacy.html" class="hover:text-indigo-400 transition">Privacy Policy</a></li>
            <li><a href="terms.html" class="hover:text-indigo-400 transition">Terms of Service</a></li>
          </ul>
        </div>

      </div>

      <!-- Bottom Line -->
      <div class="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <div>
          © 2026 TypeNest Academy. Developed by <strong class="text-slate-300">Dayanand Dinkar Kendre</strong>. All rights reserved.
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

  // Append footer to body automatically
  document.body.insertAdjacentHTML("beforeend", footerHTML);
});