/* ==========================================================================
   Buure für Biendli – interactions
   Vanilla JS, no dependencies. Every enhancement degrades gracefully.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header: scrolled state, hide on scroll down ---------- */
  function initHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) return;
    var lastY = window.scrollY;
    var ticking = false;

    function update() {
      var y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 24);
      var menuOpen = document.body.classList.contains('menu-open');
      var focusInside = header.contains(document.activeElement);
      var hide = y > 480 && y > lastY + 4 && !menuOpen && !focusInside;
      if (hide) header.classList.add('is-hidden');
      else if (y < lastY - 4 || y <= 480) header.classList.remove('is-hidden');
      lastY = y;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });
    update();
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-menu]');
    if (!toggle || !menu) return;
    var closeTimer;

    function open() {
      clearTimeout(closeTimer);
      menu.hidden = false;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { menu.classList.add('is-open'); });
      });
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    }

    function close(returnFocus) {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      closeTimer = setTimeout(function () { menu.hidden = true; }, reduceMotion ? 0 : 700);
      if (returnFocus) toggle.focus();
    }

    toggle.addEventListener('click', function () {
      toggle.getAttribute('aria-expanded') === 'true' ? close(false) : open();
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) close(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') close(true);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 880 && toggle.getAttribute('aria-expanded') === 'true') close(false);
    });
  }

  /* ---------- Button text roll ---------- */
  function initButtons() {
    document.querySelectorAll('.btn__label').forEach(function (label) {
      var text = label.textContent.trim();
      var roll = document.createElement('span');
      roll.className = 'btn__roll';
      var a = document.createElement('span');
      a.textContent = text;
      var b = document.createElement('span');
      b.textContent = text;
      b.setAttribute('aria-hidden', 'true');
      roll.append(a, b);
      label.replaceChildren(roll);
    });
  }

  /* ---------- Split heading into words (keeps inline markup like <em>) ---------- */
  function splitWords(el) {
    var index = 0;
    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var outer = document.createElement('span');
            outer.className = 'w';
            var inner = document.createElement('span');
            inner.textContent = part;
            inner.style.setProperty('--i', index++);
            outer.appendChild(inner);
            frag.appendChild(outer);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    }
    walk(el);
  }

  function initIntro() {
    document.querySelectorAll('[data-split]').forEach(splitWords);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { document.body.classList.add('is-loaded'); });
    });
  }

  /* ---------- Scroll reveals ---------- */
  function initReveal() {
    document.querySelectorAll('[data-reveal-group]').forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.style.setProperty('--i', i);
      });
    });

    var targets = document.querySelectorAll('[data-reveal], [data-reveal-group], [data-draw]');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      targets.forEach(function (t) { t.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---------- Hero parallax ---------- */
  function initParallax() {
    if (reduceMotion) return;
    var media = document.querySelector('[data-parallax]');
    var content = document.querySelector('[data-hero-content]');
    if (!media) return;
    var frame = media.parentElement;
    var ticking = false;

    function update() {
      var rect = frame.getBoundingClientRect();
      var progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
      // Media drifts down slower than the page; scaling from the bottom edge keeps the top covered
      media.style.transform = 'translate3d(0,' + (progress * 10).toFixed(2) + '%,0) scale(' + (1 + progress * 0.2).toFixed(4) + ')';
      if (content) {
        content.style.transform = 'translate3d(0,' + (progress * -60).toFixed(1) + 'px,0)';
        content.style.opacity = String(Math.max(1 - progress * 1.6, 0));
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- Active nav link ---------- */
  function initActiveNav() {
    var links = document.querySelectorAll('.nav__link');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (l) { map[l.getAttribute('href').slice(1)] = l; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (link) link.classList.toggle('is-active', entry.isIntersecting);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) io.observe(section);
    });
  }

  /* ---------- Partner logos: row, or slider once they overflow ---------- */
  function initLogos() {
    document.querySelectorAll('[data-logos]').forEach(function (root) {
      var track = root.querySelector('[data-logos-track]');
      var controls = root.querySelector('[data-logos-controls]');
      if (!track || !controls) return;
      var prev = controls.querySelector('[data-dir="-1"]');
      var next = controls.querySelector('[data-dir="1"]');

      function update() {
        var overflow = track.scrollWidth > track.clientWidth + 1;
        controls.hidden = !overflow;
        root.classList.toggle('is-overflowing', overflow);
        if (overflow) track.setAttribute('tabindex', '0');
        else track.removeAttribute('tabindex');
        prev.disabled = track.scrollLeft <= 1;
        next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
      }

      controls.addEventListener('click', function (e) {
        var btn = e.target.closest('button');
        if (!btn) return;
        var item = track.firstElementChild;
        var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        var step = item ? item.getBoundingClientRect().width + gap : track.clientWidth;
        track.scrollBy({ left: step * Number(btn.dataset.dir), behavior: reduceMotion ? 'auto' : 'smooth' });
      });

      track.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      window.addEventListener('load', update);
      update();
    });
  }

  initHeader();
  initMenu();
  initButtons();
  initIntro();
  initReveal();
  initParallax();
  initActiveNav();
  initLogos();
})();
