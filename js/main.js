/* ─────────────────────────────────────────────────────────────
   main.js — Vedang Solaskar Portfolio
   Minimal, dependency-free vanilla JavaScript
───────────────────────────────────────────────────────────── */

'use strict';

// ── DOM Ready ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initActiveNavLink();
  initContactForm();
});

/* ─────────────────────────────────────────────────────────────
   1. Navbar — scroll-triggered background
───────────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ─────────────────────────────────────────────────────────────
   2. Mobile Menu — hamburger toggle
───────────────────────────────────────────────────────────── */
function initMobileMenu() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  const toggle = () => {
    const isOpen = btn.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
    menu.classList.toggle('hidden', !isOpen);
  };

  btn.addEventListener('click', toggle);

  // Close on link click
  menu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      menu.classList.add('hidden');
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      menu.classList.add('hidden');
      btn.focus();
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   3. Scroll Reveal — IntersectionObserver-based
───────────────────────────────────────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────────────────────────
   4. Active Nav Link — highlight based on scroll position
───────────────────────────────────────────────────────────── */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const updateActive = () => {
    let current = '';
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
}

/* ─────────────────────────────────────────────────────────────
   5. Contact Form — client-side validation & mailto fallback
───────────────────────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const statusEl = document.getElementById('form-status');
  if (!form || !submitBtn || !statusEl) return;

  const setStatus = (msg, type) => {
    statusEl.textContent = msg;
    statusEl.className = 'text-xs font-mono text-center ' + (
      type === 'success' ? 'text-emerald-400' :
      type === 'error'   ? 'text-red-400' :
                           'text-zinc-500'
    );
  };

  const validate = () => {
    let valid = true;
    const name  = form.name.value.trim();
    const email = form.email.value.trim();
    const msg   = form.message.value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    [form.name, form.email, form.message].forEach(f => f.classList.remove('error'));

    if (!name) { form.name.classList.add('error'); valid = false; }
    if (!email || !emailRe.test(email)) { form.email.classList.add('error'); valid = false; }
    if (!msg) { form.message.classList.add('error'); valid = false; }

    return { valid, name, email, msg };
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { valid, name, email, msg } = validate();

    if (!valid) {
      setStatus('Please fill in all fields correctly.', 'error');
      return;
    }

    // Mailto fallback — opens default email client
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`);
    window.location.href = `mailto:hello@vedang.tech?subject=${subject}&body=${body}`;

    setStatus('Opening your email client…', 'success');
    form.reset();

    setTimeout(() => setStatus('', ''), 5000);
  });

  // Clear error state on input
  ['name', 'email', 'message'].forEach(fieldName => {
    form[fieldName]?.addEventListener('input', () => {
      form[fieldName].classList.remove('error');
      if (statusEl.textContent) setStatus('', '');
    });
  });
}
