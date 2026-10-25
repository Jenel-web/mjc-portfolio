/* ---------- Mobile menu ---------- */
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('nav-menu');

function setMenu(open) {
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menu.classList.toggle('is-open', open);
}
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });   // close after picking a link
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
});
window.matchMedia('(min-width: 640px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

/* ---------- Highlight the nav link for the section on screen ---------- */
const links = [...document.querySelectorAll('.nav-link')];
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = '#' + entry.target.id;
    links.forEach((l) => {
      if (l.getAttribute('href') === id) l.setAttribute('aria-current', 'true');
      else l.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach((s) => observer.observe(s));

/* ---------- Copyright year ---------- */
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

/* ---------- Entrances: each part rises in as its section comes on screen ---------- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('[data-reveal]');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('is-in'));
} else {
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  revealEls.forEach((el) => revealer.observe(el));
}

/* ---------- Live: the time in Manila right now ---------- */
const clock = document.getElementById('manila-time');
if (clock) {
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', hour12: false });
  const tick = () => {
    const now = new Date();
    clock.textContent = fmt.format(now) + ' now';
    clock.setAttribute('datetime', now.toISOString());
  };
  tick();
  setInterval(tick, 20000);
}

/* ---------- The hero picture drifts slowly against the scroll ---------- */
const heroImg = document.querySelector('.hero-media img');
if (heroImg && !reduceMotion) {
  let ticking = false;
  const drift = () => {
    const y = Math.min(window.scrollY, window.innerHeight);
    heroImg.style.transform = `translate3d(0, ${y * 0.08}px, 0)`;
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(drift); } }, { passive: true });
}

/* ---------- The name is fitted to the page width, whatever font actually loaded ---------- */
const fitEls = document.querySelectorAll('[data-fit]');
function fitNames() {
  fitEls.forEach((el) => {
    const cs = getComputedStyle(el);
    const avail = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const range = document.createRange();
    el.style.whiteSpace = 'nowrap';
    el.style.fontSize = '100px';
    const parts = [...el.querySelectorAll("span")];
    let widest = 0;
    if (parts.length && getComputedStyle(parts[0]).display === "block") {
      parts.forEach((s) => { range.selectNodeContents(s.firstChild); widest = Math.max(widest, range.getBoundingClientRect().width); });
    } else {
      range.selectNodeContents(el);
      widest = range.getBoundingClientRect().width;
    }
    if (widest > 0 && avail > 0) el.style.fontSize = Math.floor((100 * avail / widest) * 10) / 10 + 'px';
  });
}
fitNames();
window.addEventListener('resize', fitNames);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitNames);
