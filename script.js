/* ═══════════════════════════════════════════════════════════════
   VEDANG SOLASKAR — PORTFOLIO SCRIPTS
   Minimal, vanilla JS — no dependencies
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Mobile Menu Toggle ──
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      const isOpen = !mobileMenu.classList.contains('hidden');

      if (isOpen) {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
      } else {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('flex');
        menuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
      }
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
      });
    });
  }

  // ── Navbar Shrink on Scroll ──
  const navbar = document.getElementById('navbar');

  if (navbar) {
    var lastScrollY = 0;

    window.addEventListener('scroll', function () {
      var currentScrollY = window.scrollY;

      if (currentScrollY > 60) {
        navbar.classList.add('py-2');
        navbar.style.borderBottomColor = 'rgba(63, 63, 70, 0.6)';
      } else {
        navbar.classList.remove('py-2');
        navbar.style.borderBottomColor = '';
      }

      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  // ── Intersection Observer for Fade-in ──
  var fadeElements = document.querySelectorAll('.fade-in');

  if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: make everything visible
    fadeElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ── Contact Form (Frontend Only) ──
  var contactForm = document.getElementById('contact-form');
  var formFeedback = document.getElementById('form-feedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = contactForm.querySelector('#name').value.trim();
      var email = contactForm.querySelector('#email').value.trim();
      var message = contactForm.querySelector('#message').value.trim();

      // Basic validation
      if (!name || !email || !message) {
        formFeedback.textContent = 'Please fill in all fields.';
        formFeedback.className = 'text-sm text-center text-red-400 mt-2';
        formFeedback.classList.remove('hidden');
        return;
      }

      // Simple email check
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        formFeedback.textContent = 'Please enter a valid email address.';
        formFeedback.className = 'text-sm text-center text-red-400 mt-2';
        formFeedback.classList.remove('hidden');
        return;
      }

      // Build mailto link from form data
      var subject = encodeURIComponent('Portfolio Contact: Message from ' + name);
      var body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
      var mailtoLink = 'mailto:hello@vedang.tech?subject=' + subject + '&body=' + body;
      window.location.href = mailtoLink;

      formFeedback.textContent = 'Opening your email client…';
      formFeedback.className = 'text-sm text-center text-green-400 mt-2';
      formFeedback.classList.remove('hidden');
      contactForm.reset();

      // Hide feedback after 5 seconds
      setTimeout(function () {
        formFeedback.classList.add('hidden');
      }, 5000);
    });
  }

  // ── Active Nav Link Highlight ──
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener('scroll', function () {
      var scrollPos = window.scrollY + 120;

      sections.forEach(function (section) {
        var top = section.offsetTop;
        var height = section.offsetHeight;
        var id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(function (link) {
            link.classList.remove('text-white');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('text-white');
            }
          });
        }
      });
    }, { passive: true });
  }
})();
