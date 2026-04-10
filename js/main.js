/* ============================================
   The Machinist's Hemi — Main JavaScript
   ============================================ */

(function () {
  'use strict';

  // ---- Header scroll effect ----
  const header = document.getElementById('site-header');
  let lastScroll = 0;

  function onScroll() {
    const y = window.pageYOffset;
    if (y > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile nav toggle ----
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = anchor.getAttribute('href');
      if (href === '#') return;

      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      var offset = header.offsetHeight;
      var y = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });

      // Close mobile nav
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ---- Scroll-triggered animations ----
  var animElements = document.querySelectorAll('.fade-in-up');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    animElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything
    animElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // ---- Lightbox ----
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = lightbox.querySelector('.lightbox-img');
  var lightboxClose = lightbox.querySelector('.lightbox-close');
  var lightboxPrev = lightbox.querySelector('.lightbox-prev');
  var lightboxNext = lightbox.querySelector('.lightbox-next');
  var lightboxOverlay = lightbox.querySelector('.lightbox-overlay');

  var galleryItems = [];
  var currentIndex = 0;

  // Build gallery items array
  document.querySelectorAll('.gallery-trigger').forEach(function (btn, i) {
    galleryItems.push({
      full: btn.getAttribute('data-full'),
      alt: btn.getAttribute('data-alt')
    });

    btn.addEventListener('click', function () {
      openLightbox(i);
    });
  });

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxImage();
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    lightboxClose.focus();
    document.addEventListener('keydown', onLightboxKey);
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
    document.removeEventListener('keydown', onLightboxKey);

    // Return focus to the trigger that opened it
    var triggers = document.querySelectorAll('.gallery-trigger');
    if (triggers[currentIndex]) {
      triggers[currentIndex].focus();
    }
  }

  function navigate(direction) {
    currentIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;
    updateLightboxImage();
  }

  function updateLightboxImage() {
    var item = galleryItems[currentIndex];
    lightboxImg.src = item.full;
    lightboxImg.alt = item.alt;
  }

  function onLightboxKey(e) {
    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        navigate(-1);
        break;
      case 'ArrowRight':
        navigate(1);
        break;
      case 'Tab':
        trapFocus(e);
        break;
    }
  }

  function trapFocus(e) {
    var focusable = [lightboxClose, lightboxPrev, lightboxNext];
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', function () { navigate(-1); });
  lightboxNext.addEventListener('click', function () { navigate(1); });

  // Touch swipe support for lightbox
  var touchStartX = 0;
  var touchEndX = 0;

  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    var diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        navigate(1);  // Swipe left = next
      } else {
        navigate(-1); // Swipe right = prev
      }
    }
  }, { passive: true });

})();
