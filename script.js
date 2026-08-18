/* ══════════════════════════════════════════
   TRON DEVELOPS — SITE SCRIPT
   Shared across all pages. Page-specific blocks
   are guarded so they no-op on pages without
   the relevant markup.
══════════════════════════════════════════ */
(function () {
  'use strict';

  /* ---------- LOADER ---------- */
  window.addEventListener('load', function () {
    setTimeout(function () {
      var loader = document.getElementById('loader');
      if (loader) loader.classList.add('hidden');
    }, 1400);
  });
  window.addEventListener('pageshow', function () {
    var pt = document.getElementById('pt');
    var loader = document.getElementById('loader');
    if (pt) pt.classList.remove('entering');
    if (loader) loader.classList.add('hidden');
  });

  /* ---------- CUSTOM CURSOR ---------- */
  var dot = document.getElementById('cur-dot');
  var ring = document.getElementById('cur-ring');
  var mx = 0, my = 0, rx = 0, ry = 0;
  if (dot && ring) {
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });
    (function ringLoop() {
      rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(ringLoop);
    })();
    var hoverSelector = 'a, button, .work-card, .process-step, .svc-card, .pkg-card, ' +
      '.stat-card, .mission-card, .aud-row, .proj-row-item, .info-card, .faq-q';
    document.querySelectorAll(hoverSelector).forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('hovering'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('hovering'); });
    });
  }

  /* ---------- NAV SCROLL + PROGRESS BAR ---------- */
  var nav = document.getElementById('main-nav');
  var prog = document.getElementById('scroll-progress');
  window.addEventListener('scroll', function () {
    var st = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', st > 20);
    if (prog) {
      var docH = document.body.scrollHeight - window.innerHeight;
      prog.style.width = (docH > 0 ? (st / docH * 100) : 0) + '%';
    }
  }, { passive: true });

  /* ---------- HAMBURGER / MOBILE NAV ---------- */
  var ham = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobile-nav');
  if (ham && mobileNav) {
    ham.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
      var spans = ham.querySelectorAll('span');
      if (mobileNav.classList.contains('open')) {
        spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
      } else {
        spans[0].style.transform = ''; spans[1].style.opacity = ''; spans[2].style.transform = '';
      }
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mobileNav.classList.remove('open'); });
    });
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  var reveals = document.querySelectorAll('.reveal');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(function (el) { io.observe(el); });

  /* ---------- SKILL BARS (if present) ---------- */
  var bars = document.querySelectorAll('.skill-bar-fill');
  if (bars.length) {
    var barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var target = entry.target;
          target.style.width = target.getAttribute('data-w') + '%';
          barObserver.unobserve(target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(function (b) { barObserver.observe(b); });
  }

  /* ---------- COUNTER ANIMATION (if present) ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    function animateCount(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      if (!target) return;
      var duration = 1600, startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); countObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { countObserver.observe(c); });
  }

  /* ---------- HOME: EXPERTISE PINNED HORIZONTAL SCROLL ---------- */
  var pin = document.getElementById('expertise-pin');
  var track = document.getElementById('expertise-track');
  if (pin && track) {
    function updateExpertise() {
      if (window.innerWidth <= 820) { track.style.transform = 'none'; return; }
      var rect = pin.getBoundingClientRect();
      var total = pin.offsetHeight - window.innerHeight;
      var scrolled = -rect.top;
      var progress = Math.min(Math.max(scrolled / total, 0), 1);
      var panels = track.children.length;
      var maxTranslate = (panels - 1) * window.innerWidth;
      track.style.transform = 'translateX(-' + (progress * maxTranslate) + 'px)';
    }
    window.addEventListener('scroll', updateExpertise, { passive: true });
    window.addEventListener('resize', updateExpertise);
    updateExpertise();
  }

  /* ---------- ABOUT: WORD-BY-WORD SCROLL HIGHLIGHT PARAGRAPH ---------- */
  var hlPara = document.getElementById('hl-para');
  if (hlPara) {
    var words = hlPara.textContent.trim().split(/\s+/);
    hlPara.innerHTML = words.map(function (w) { return '<span class="wd">' + w + ' </span>'; }).join('');
    var wdEls = hlPara.querySelectorAll('.wd');
    function updateHighlight() {
      var rect = hlPara.getBoundingClientRect();
      var vh = window.innerHeight;
      var progress = (vh * 0.75 - rect.top) / rect.height;
      progress = Math.min(Math.max(progress, 0), 1);
      var litCount = Math.round(progress * wdEls.length);
      wdEls.forEach(function (el, i) { el.classList.toggle('lit', i < litCount); });
    }
    window.addEventListener('scroll', updateHighlight, { passive: true });
    window.addEventListener('resize', updateHighlight);
    updateHighlight();
  }

  /* ---------- ABOUT: AUDIENCE LIST — highlight row nearest viewport center ---------- */
  var audRows = document.querySelectorAll('.aud-row');
  if (audRows.length) {
    function updateAudience() {
      var center = window.innerHeight / 2, closest = null, minDist = Infinity;
      audRows.forEach(function (row) {
        var r = row.getBoundingClientRect();
        var mid = r.top + r.height / 2;
        var d = Math.abs(mid - center);
        if (d < minDist) { minDist = d; closest = row; }
      });
      audRows.forEach(function (row) { row.classList.toggle('active', row === closest); });
    }
    window.addEventListener('scroll', updateAudience, { passive: true });
    window.addEventListener('resize', updateAudience);
    updateAudience();
  }

  /* ---------- FAQ ACCORDION (projects, services) ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q'), a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  /* ---------- SERVICES: CURRENCY TOGGLE (main) ---------- */
  var curToggle = document.getElementById('currency-toggle');
  if (curToggle) {
    var priceEls = document.querySelectorAll('[data-inr][data-usd]');
    curToggle.querySelectorAll('.currency-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cur = btn.getAttribute('data-currency');
        curToggle.querySelectorAll('.currency-btn').forEach(function (b) { b.classList.toggle('active', b === btn); });
        priceEls.forEach(function (el) { el.textContent = cur === 'usd' ? el.getAttribute('data-usd') : el.getAttribute('data-inr'); });
      });
    });
  }

  /* ---------- CONTACT: CURRENCY TOGGLE (mini, budget labels) ---------- */
  var curToggleMini = document.getElementById('currency-toggle-mini');
  if (curToggleMini) {
    var budgetLabels = document.querySelectorAll('.budget-label[data-inr][data-usd]');
    curToggleMini.querySelectorAll('.currency-btn-mini').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cur = btn.getAttribute('data-currency');
        curToggleMini.querySelectorAll('.currency-btn-mini').forEach(function (b) { b.classList.toggle('active', b === btn); });
        budgetLabels.forEach(function (el) { el.textContent = cur === 'usd' ? el.getAttribute('data-usd') : el.getAttribute('data-inr'); });
      });
    });
  }

  /* ---------- CONTACT: FORM SUBMIT (AJAX to Formspree) ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var statusEl = document.getElementById('form-status');
    var submitBtn = document.getElementById('submit-btn');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (res) {
          if (res.ok) {
            statusEl.textContent = "Thanks — message sent. We'll reply within 24 hours.";
            statusEl.style.color = '#16a34a';
            form.reset();
          } else {
            statusEl.textContent = 'Something went wrong — please email trondevelops@gmail.com directly.';
            statusEl.style.color = '#dc2626';
          }
          statusEl.style.display = 'block';
          submitBtn.textContent = 'Send Message →';
          submitBtn.disabled = false;
        })
        .catch(function () {
          statusEl.textContent = 'Something went wrong — please email trondevelops@gmail.com directly.';
          statusEl.style.color = '#dc2626';
          statusEl.style.display = 'block';
          submitBtn.textContent = 'Send Message →';
          submitBtn.disabled = false;
        });
    });
  }

  /* ---------- PAGE TRANSITIONS ---------- */
  var pt = document.getElementById('pt');
  document.querySelectorAll('a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || a.getAttribute('target') === '_blank') return;
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var dest = href;
      if (pt) pt.classList.add('entering');
      setTimeout(function () { window.location.href = dest; }, 300);
    });
  });

})();
