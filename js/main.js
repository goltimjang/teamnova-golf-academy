/* ═══════════════════════════════════════════
   TEAM NOVA GOLF ACADEMY — Interactions
   ═══════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Preloader ── */
  var preloader = document.getElementById('preloader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      preloader.classList.add('is-done');
      document.body.classList.add('is-loaded');
    }, 900);
  });
  // Fallback: never block the page more than 3.5s
  setTimeout(function () {
    preloader.classList.add('is-done');
    document.body.classList.add('is-loaded');
  }, 3500);

  /* ── Nav: scroll state + hide on scroll down ── */
  var nav = document.getElementById('nav');
  var floatCta = document.getElementById('floatCta');
  var stickyBar = document.getElementById('stickyBar');
  var lastY = 0;

  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    if (y > 300 && y > lastY && !navMenu.classList.contains('is-open')) {
      nav.classList.add('is-hidden');
    } else {
      nav.classList.remove('is-hidden');
    }
    var showCta = y > window.innerHeight * 0.6;
    floatCta.classList.toggle('is-visible', showCta);
    stickyBar.classList.toggle('is-visible', showCta);
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile menu ── */
  var burger = document.getElementById('navBurger');
  var navMenu = document.getElementById('navMenu');
  burger.addEventListener('click', function () {
    var open = navMenu.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  navMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navMenu.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ── Scroll reveal ── */
  var revealEls = document.querySelectorAll('.reveal, .reveal-img');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  revealEls.forEach(function (el) { io.observe(el); });

  /* Stagger siblings inside grids */
  ['.philosophy__values', '.system__steps', '.stats__grid', '.programs__grid', '.facilities__grid'].forEach(function (sel) {
    var wrap = document.querySelector(sel);
    if (!wrap) return;
    Array.prototype.forEach.call(wrap.children, function (child, i) {
      child.style.transitionDelay = (i * 110) + 'ms';
    });
  });

  /* ── System gold line ── */
  var sysLine = document.querySelector('.system__line');
  if (sysLine) {
    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { sysLine.classList.add('is-in'); obs.disconnect(); }
      });
    }, { threshold: 0.4 }).observe(sysLine);
  }

  /* ── Counters ── */
  var counters = document.querySelectorAll('.counter');
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      var el = e.target;
      var target = parseInt(el.dataset.count, 10);
      var start = null;
      var dur = 1400;
      function tick(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  counters.forEach(function (c) { cio.observe(c); });

  /* ── Video gallery ── */
  var scroller = document.getElementById('galleryScroller');
  var clips = document.querySelectorAll('.clip');

  // Autoplay muted preview when in view
  var vio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var video = e.target.querySelector('video');
      if (e.isIntersecting) {
        video.play().catch(function () {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.35 });
  clips.forEach(function (clip) { vio.observe(clip); });

  // Click: toggle sound (unmute one at a time)
  clips.forEach(function (clip) {
    clip.addEventListener('click', function () {
      var video = clip.querySelector('video');
      var wasMuted = video.muted;
      clips.forEach(function (c) {
        var v = c.querySelector('video');
        v.muted = true;
        c.classList.remove('is-playing');
      });
      if (wasMuted) {
        video.muted = false;
        video.play().catch(function () {});
        clip.classList.add('is-playing');
      }
    });
  });

  // Drag to scroll (desktop)
  var isDown = false, startX = 0, scrollLeft = 0, moved = false;
  scroller.addEventListener('mousedown', function (e) {
    isDown = true; moved = false;
    scroller.classList.add('is-dragging');
    startX = e.pageX; scrollLeft = scroller.scrollLeft;
  });
  window.addEventListener('mouseup', function () {
    isDown = false;
    scroller.classList.remove('is-dragging');
  });
  scroller.addEventListener('mousemove', function (e) {
    if (!isDown) return;
    var dx = e.pageX - startX;
    if (Math.abs(dx) > 6) moved = true;
    scroller.scrollLeft = scrollLeft - dx;
  });
  scroller.addEventListener('click', function (e) {
    if (moved) { e.stopPropagation(); e.preventDefault(); }
  }, true);

  /* ── Hero video: 자막 없는 밝은 구간(2~12초)만 반복 ── */
  var heroClip = document.querySelector('.hero__video');
  if (heroClip) {
    var SEG_START = 2, SEG_END = 6.5;
    var seekToStart = function () {
      if (heroClip.readyState >= 1) heroClip.currentTime = SEG_START;
    };
    heroClip.addEventListener('loadedmetadata', seekToStart);
    seekToStart();
    heroClip.addEventListener('timeupdate', function () {
      if (heroClip.currentTime >= SEG_END || heroClip.currentTime < SEG_START - 0.5) {
        heroClip.currentTime = SEG_START;
      }
    });
  }

  /* ── Hero parallax ── */
  var heroVideo = document.querySelector('.hero__video');
  var heroContent = document.querySelector('.hero__content');
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        heroContent.style.transform = 'translateY(' + (y * 0.18) + 'px)';
        heroContent.style.opacity = Math.max(1 - y / (window.innerHeight * 0.85), 0);
      }
      ticking = false;
    });
  }, { passive: true });

  /* ── FAQ: close others ── */
  var faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ── Smooth anchor offset for fixed nav ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── Year ── */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
