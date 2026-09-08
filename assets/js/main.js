(function () {
  "use strict";

  /* Header scroll state */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (window.scrollY > 12) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  var navToggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  function closeMobileNav() {
    mobileNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  navToggle.addEventListener('click', function () {
    var open = mobileNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  mobileNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMobileNav);
  });

  /* Scroll reveal (single simple pass, respects reduced motion).
     Elements are visible by default in CSS; only after we know
     IntersectionObserver is available do we opt into the hidden
     start state, so a slow or failed script never hides content. */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.reveal');
  if (!prefersReduced && 'IntersectionObserver' in window && revealEls.length) {
    document.documentElement.classList.add('js-reveal-ready');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
    revealEls.forEach(function (el) {
      // Anything already in view on load should just be visible immediately.
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.05) {
        el.classList.add('is-visible');
      } else {
        io.observe(el);
      }
    });
  }

  /* Lightbox */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose = document.getElementById('lightboxClose');
  var lastFocused = null;

  function openLightbox(src, alt, caption) {
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightboxCaption.textContent = caption || '';
    lightbox.classList.add('is-open');
    lightboxClose.focus();
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightboxImg.src = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('.lightbox-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      var img = trigger.querySelector('img');
      openLightbox(trigger.getAttribute('href'), img ? img.alt : '', trigger.getAttribute('data-caption'));
    });
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });
})();
