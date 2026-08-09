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
        video.play().catch(function () {
          // 소리 재생이 막힌 환경에서는 무음으로라도 재생
          video.muted = true;
          video.play().catch(function () {});
        });
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
    if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; }
  }, true);

  /* ── Hero: 30초 편집 영상 루프 재생 (PC는 블러 배경 레이어 동시 재생) ── */
  var heroLayerA = document.getElementById('heroLayerA');
  var heroBg = document.getElementById('heroBg');
  var heroWide = window.matchMedia('(min-width: 900px)');
  if (heroLayerA) {
    function safePlay(v) {
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    }
    function bgActive() { return heroBg && heroWide.matches; }
    safePlay(heroLayerA);
    if (bgActive()) safePlay(heroBg);
    // 화면 폭이 바뀌면(창 크기 조절) 블러 배경 재생/정지 전환
    var onWide = function () {
      if (!heroBg) return;
      if (heroWide.matches) { heroBg.currentTime = heroLayerA.currentTime; safePlay(heroBg); }
      else heroBg.pause();
    };
    if (heroWide.addEventListener) heroWide.addEventListener('change', onWide);
    // 블러 배경이 본 영상과 어긋나면 주기적으로 맞춤
    setInterval(function () {
      if (bgActive() && !heroBg.paused && Math.abs(heroBg.currentTime - heroLayerA.currentTime) > 0.3) {
        heroBg.currentTime = heroLayerA.currentTime;
      }
    }, 2000);
    // 자동재생이 차단된 환경(저전력 모드 등): 첫 터치/스크롤에서 재생 재개
    function resumeHero() {
      if (heroLayerA.paused) safePlay(heroLayerA);
      if (bgActive() && heroBg.paused) safePlay(heroBg);
    }
    ['touchstart', 'click', 'scroll'].forEach(function (ev) {
      window.addEventListener(ev, resumeHero, { once: true, passive: true });
    });
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) resumeHero();
    });
  }

  /* ── 성과 섹션: 수상 사진 슬라이더 ── */
  var rSlider = document.getElementById('resultsSlider');
  var rDots = document.getElementById('resultsDots');
  if (rSlider && rDots) {
    var rImgs = rSlider.querySelectorAll('img');
    var rCur = 0;
    rImgs.forEach(function (_, i) {
      var d = document.createElement('span');
      if (i === 0) d.classList.add('is-on');
      d.addEventListener('click', function () { rGo(i); rHold(); });
      rDots.appendChild(d);
    });
    var rDotEls = rDots.querySelectorAll('span');
    function rGo(i) {
      rCur = (i + rImgs.length) % rImgs.length;
      rSlider.scrollTo({ left: rSlider.clientWidth * rCur, behavior: 'smooth' });
    }
    function rMark() {
      var i = Math.round(rSlider.scrollLeft / rSlider.clientWidth);
      if (i !== rCur) rCur = i;
      rDotEls.forEach(function (d, n) { d.classList.toggle('is-on', n === rCur); });
    }
    rSlider.addEventListener('scroll', function () { requestAnimationFrame(rMark); }, { passive: true });
    // 4.5초마다 자동 넘김 — 사용자가 직접 넘기면 잠시 멈춤
    var rPaused = false, rTimer = null;
    function rHold() {
      rPaused = true;
      clearTimeout(rTimer);
      rTimer = setTimeout(function () { rPaused = false; }, 8000);
    }
    rSlider.addEventListener('touchstart', rHold, { passive: true });
    rSlider.addEventListener('mousedown', rHold);
    rSlider.addEventListener('wheel', rHold, { passive: true });
    setInterval(function () {
      if (!rPaused && document.visibilityState === 'visible') rGo(rCur + 1);
    }, 4500);
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
