/* Trilocore — minimal site interactions.
   Restrained by design: scroll reveal + one-time stat counters. No canvas, no orbs. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Subtle scroll reveal ─────────────────────────────────────────── */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); revObs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revObs.observe(el); });
  }

  /* ── One-time stat counters ───────────────────────────────────────── */
  function animateCounter(el) {
    var target = parseFloat(el.dataset.target);
    if (reduceMotion) { el.textContent = formatNum(target); return; }
    var duration = 1200, start = performance.now();
    function step(now) {
      var t = Math.min((now - start) / duration, 1);
      var ease = 1 - Math.pow(1 - t, 3);
      el.textContent = formatNum(Math.floor(ease * target));
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = formatNum(target);
    }
    requestAnimationFrame(step);
  }
  function formatNum(n) { return Number(n).toLocaleString(); }

  var stats = document.querySelector(".stats");
  if (stats && "IntersectionObserver" in window) {
    var statObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          document.querySelectorAll(".counter").forEach(animateCounter);
          statObs.disconnect();
        }
      });
    }, { threshold: 0.4 });
    statObs.observe(stats);
  } else {
    document.querySelectorAll(".counter").forEach(animateCounter);
  }

  /* ── Active nav link on scroll ────────────────────────────────────── */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav-links a");
  if (sections.length && navLinks.length) {
    window.addEventListener("scroll", function () {
      var cur = "";
      sections.forEach(function (s) {
        if (window.scrollY >= s.offsetTop - 120) cur = s.id;
      });
      navLinks.forEach(function (a) {
        a.style.color = a.getAttribute("href") === "#" + cur ? "var(--text)" : "";
      });
    }, { passive: true });
  }

  /* ── Footer year ──────────────────────────────────────────────────── */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
