// portfolio.js — Ayoub RAFIK

// translations
const i18n = {
  fr: {
    'nav.home':    'Accueil',
    'nav.about':   'À propos',
    'nav.bts':     'BTS SIO',
    'nav.e5':      'Épreuve E5',
    'nav.e6':      'Épreuve E6',
    'nav.veille':  'Veille',
    'nav.skills':  'Compétences',
    'nav.contact': 'Contact',
    'nav.lang':    'EN',
    'nav.dark':    '☀️',
    'nav.light':   '🌙',
    'footer.copy': 'Fait avec ❤️ par Ayoub RAFIK',
    'footer.host': 'Hébergé sur GitHub Pages',
  },
  en: {
    'nav.home':    'Home',
    'nav.about':   'About',
    'nav.bts':     'BTS SIO',
    'nav.e5':      'Project E5',
    'nav.e6':      'Project E6',
    'nav.veille':  'Tech Watch',
    'nav.skills':  'Skills',
    'nav.contact': 'Contact',
    'nav.lang':    'FR',
    'nav.dark':    '☀️',
    'nav.light':   '🌙',
    'footer.copy': 'Made with ❤️ by Ayoub RAFIK',
    'footer.host': 'Hosted on GitHub Pages',
  }
};

/* ===== STATE ===== */
let currentLang  = localStorage.getItem('ar-lang')  || 'fr';
let currentTheme = localStorage.getItem('ar-theme') || 'dark';

/* ===== THEME ===== */
function applyTheme(t) {
  if (t === 'light') {
    document.body.classList.add('light');
  } else {
    document.body.classList.remove('light');
  }
  // update buttons
  document.querySelectorAll('.js-theme-btn').forEach(btn => {
    btn.textContent = t === 'dark' ? '☀️  Light' : '🌙  Dark';
  });
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('ar-theme', currentTheme);
  applyTheme(currentTheme);
}

/* ===== LANGUAGE ===== */
function applyLang(lang) {
  const dict = i18n[lang];
  // translate data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  // swap data-fr / data-en content
  document.querySelectorAll('[data-fr]').forEach(el => {
    const val = lang === 'fr' ? el.getAttribute('data-fr') : el.getAttribute('data-en');
    if (val !== null) el.innerHTML = val;
  });
  // update lang toggle label
  document.querySelectorAll('.js-lang-btn').forEach(btn => {
    btn.textContent = dict['nav.lang'];
  });
  // update html lang attribute
  document.documentElement.lang = lang;
}

function toggleLang() {
  currentLang = currentLang === 'fr' ? 'en' : 'fr';
  localStorage.setItem('ar-lang', currentLang);
  applyLang(currentLang);
  // restart typewriter if on index
  if (typeof startTypewriter === 'function') startTypewriter();
}

/* ===== MOBILE MENU ===== */
function toggleMenu() {
  const drawer = document.getElementById('navDrawer');
  if (drawer) drawer.classList.toggle('open');
}

/* ===== ACTIVE NAV ===== */
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const page = href.replace('./', '').replace('/', '');
    if (page === path || (path === '' && page === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // stagger children
        if (entry.target.classList.contains('stagger')) {
          entry.target.querySelectorAll(':scope > *').forEach((child, i) => {
            setTimeout(() => child.classList.add('visible'), i * 80);
          });
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fade-up, .stagger').forEach(el => observer.observe(el));
}

/* ===== TYPEWRITER (index page) ===== */
const subtitles = {
  fr: ['Étudiant BTS SIO — option SISR', 'Réseaux · Systèmes · Virtualisation', 'En recherche d\'alternance Sept. 2025'],
  en: ['BTS SIO student — SISR track', 'Networks · Systems · Virtualization', 'Looking for work-study from Sept. 2025']
};
let twIndex = 0, twChar = 0, twDeleting = false, twTimer = null;

function startTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  clearTimeout(twTimer);
  twIndex = 0; twChar = 0; twDeleting = false;
  el.textContent = '';
  tick();
}

function tick() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const words = subtitles[currentLang];
  const current = words[twIndex % words.length];

  if (!twDeleting) {
    el.textContent = current.substring(0, twChar + 1);
    twChar++;
    if (twChar === current.length) {
      twDeleting = true;
      twTimer = setTimeout(tick, 2200);
      return;
    }
  } else {
    el.textContent = current.substring(0, twChar - 1);
    twChar--;
    if (twChar === 0) {
      twDeleting = false;
      twIndex++;
      twTimer = setTimeout(tick, 300);
      return;
    }
  }
  twTimer = setTimeout(tick, twDeleting ? 45 : 75);
}

/* ===== COMPETENCE ACCORDIONS ===== */
function initAccordions() {
  document.querySelectorAll('.bloc-header').forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const isOpen = header.classList.contains('open');
      // close all
      document.querySelectorAll('.bloc-header').forEach(h => {
        h.classList.remove('open');
        if (h.nextElementSibling) h.nextElementSibling.classList.remove('open');
      });
      // toggle clicked
      if (!isOpen) {
        header.classList.add('open');
        body.classList.add('open');
      }
    });
  });
  // open first by default
  const first = document.querySelector('.bloc-header');
  if (first) {
    first.classList.add('open');
    if (first.nextElementSibling) first.nextElementSibling.classList.add('open');
  }
}

/* ===== CONTACT FORM ===== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.querySelector('[name="email"]').value;
    const subject = encodeURIComponent(form.querySelector('[name="subject"]').value || 'Contact depuis portfolio');
    const body = encodeURIComponent(
      `Prénom: ${form.querySelector('[name="firstname"]').value}\n` +
      `Nom: ${form.querySelector('[name="lastname"]').value}\n\n` +
      form.querySelector('[name="message"]').value
    );
    window.location.href = `mailto:rafikayoub453@gmail.com?subject=${subject}&body=${body}&reply-to=${encodeURIComponent(email)}`;
  });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme);
  applyLang(currentLang);
  setActiveNav();
  initScrollAnimations();
  initAccordions();
  initContactForm();
  // typewriter only on index
  if (document.getElementById('typewriter')) {
    startTypewriter();
  }
});
