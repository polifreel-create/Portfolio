/* =========================================================
   Портфолио — анимации
   1. Большое имя при скролле плавно сжимается в шапку
   2. Шапка и имя меняют цвет над тёмным / белым фоном
   3. Обложки кейсов анимируются, только когда видны на экране
   4. Видео играют только в зоне видимости
   ========================================================= */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };
  var header = $('header'), hero = $('hero'), nameEl = $('name');

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function inOut(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  /* ---------- Имя и шапка ---------- */
  var links = document.querySelector('.links'), baseFont = 0;
  // имя всегда помещается: на десктопе — слева от ссылок, на телефоне — под ними на всю ширину
  function fitName() {
    nameEl.style.fontSize = '';
    var W = innerWidth, g = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gutter')) || 16;
    var f = parseFloat(getComputedStyle(nameEl).fontSize);
    var w = nameEl.scrollWidth;
    var mobile = W < 700;
    var maxW = mobile ? W - 2 * g : W - 2 * g - links.offsetWidth - 32;
    if (w > maxW) { f = f * maxW / w; nameEl.style.fontSize = f.toFixed(1) + 'px'; }
    baseFont = f;
  }
  function frame() {
    var H = innerHeight, y = scrollY;
    var hr = hero.getBoundingClientRect();
    var light = hr.bottom < 60;
    header.classList.toggle('on-light', light);
    header.classList.toggle('scrolled', y > 30);
    nameEl.classList.toggle('on-light', light);

    // 0 — имя во весь экран, 1 — имя в шапке (размер ~ 26px)
    var e = reduce ? 1 : inOut(clamp(y / (H * .45)));
    var mobile = innerWidth < 700;
    var target = (mobile ? 22 : 26) / (baseFont || 100);
    var restY = mobile ? links.getBoundingClientRect().bottom + 10 - 14 : 0;
    nameEl.style.transform = 'translate3d(0,' + lerp(restY, 4, e).toFixed(1) + 'px,0) scale(' + lerp(1, target, e).toFixed(4) + ')';
  }
  var ticking = false;
  function request() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; frame(); });
  }
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', function () { fitName(); request(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fitName(); request(); });
  fitName(); frame();

  /* ---------- Обложки: играть только в зоне видимости ---------- */
  var anims = document.querySelectorAll('[data-anim]');
  function setPlay(el, on) {
    el.classList.toggle('play', on);
  }
  if ('IntersectionObserver' in window && !reduce) {
    var ao = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { setPlay(e.target, e.isIntersecting); });
    }, { threshold: .3 });
    anims.forEach(function (el) { ao.observe(el); });
  } else {
    anims.forEach(function (el) { el.classList.add('play'); });
  }

  /* ---------- Видео ---------- */
  var videos = document.querySelectorAll('video.autoplay');
  if ('IntersectionObserver' in window) {
    var vo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !reduce) { var p = e.target.play(); if (p && p.catch) p.catch(function () {}); }
        else e.target.pause();
      });
    }, { threshold: .35 });
    videos.forEach(function (v) { vo.observe(v); });
  }
})();
