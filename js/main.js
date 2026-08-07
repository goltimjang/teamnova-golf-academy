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

  /* ── Hero: 자막 없는 구간들을 이어 붙인 몽타주 재생 ── */
  var layerA = document.getElementById('heroLayerA');
  var layerB = document.getElementById('heroLayerB');
  if (layerA && layerB) {
    var SEGS = [
      { src: 'assets/video/train-2.mp4', start: 1.2, end: 4.6 },   // 드라이버 풀스윙 (하늘)
      { src: 'assets/video/train-5.mp4', start: 4.2, end: 8.0 },   // 주니어 레인지 스윙
      { src: 'assets/video/train-4.mp4', start: 6.2, end: 11.0 },  // 벙커 훈련
      { src: 'assets/video/train-1.mp4', start: 1.1, end: 3.4 }    // 필드 스윙
    ];
    var layers = [layerA, layerB];
    var cur = 0;      // 현재 재생 중인 세그먼트
    var frontI = 0;   // 앞에 보이는 레이어
    var lock = false;

    function safePlay(v) {
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    }

    // 레이어에 세그먼트를 로드하고 시작 지점으로 이동
    function setSeg(v, seg, cb) {
      var apply = function () {
        try { v.currentTime = seg.start; } catch (e) {}
        v._seg = seg;
        if (cb) cb();
      };
      if (v.getAttribute('data-seg-src') !== seg.src) {
        v.setAttribute('data-seg-src', seg.src);
        v.src = seg.src;
        v.addEventListener('loadeddata', apply, { once: true });
        v.load();
      } else {
        apply();
      }
    }

    function advance() {
      if (lock) return;
      lock = true;
      cur = (cur + 1) % SEGS.length;
      var seg = SEGS[cur];
      var oldFront = layers[frontI];
      frontI = 1 - frontI;
      var newFront = layers[frontI];
      setSeg(newFront, seg, function () {
        // 시작 지점 seek가 끝난 뒤에만 화면을 전환해 자막 프레임 노출을 방지
        var show = function () {
          safePlay(newFront);
          newFront.classList.add('is-front');
          oldFront.classList.remove('is-front');
          setTimeout(function () {
            oldFront.pause();
            setSeg(oldFront, SEGS[(cur + 1) % SEGS.length]);
            lock = false;
          }, 750);
        };
        if (Math.abs(newFront.currentTime - seg.start) > 0.3) {
          newFront.addEventListener('seeked', show, { once: true });
          newFront.currentTime = seg.start;
          // seek 이벤트가 오지 않는 예외 상황 방어
          setTimeout(function () { if (lock && !newFront.classList.contains('is-front')) show(); }, 800);
        } else {
          show();
        }
      });
    }

    layers.forEach(function (v) {
      v.addEventListener('timeupdate', function () {
        if (lock || layers[frontI] !== v || !v._seg) return;
        if (v.currentTime >= v._seg.end) advance();
      });
      // 세그먼트 끝을 넘어 영상이 끝나버린 경우 방어
      v.addEventListener('ended', function () {
        if (layers[frontI] === v) advance();
      });
    });

    setSeg(layerA, SEGS[0], function () { safePlay(layerA); });
    setSeg(layerB, SEGS[1]);
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
