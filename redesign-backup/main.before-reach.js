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

/* ---------- Projects: left and right buttons move the window ---------- */
const carousel = document.getElementById('carousel');
const navBtns = document.querySelectorAll('.carousel-btn');
function updateNav() {
  const max = carousel.scrollWidth - carousel.clientWidth - 1;
  navBtns.forEach((btn) => { btn.disabled = Number(btn.dataset.dir) < 0 ? carousel.scrollLeft <= 1 : carousel.scrollLeft >= max; });
}
navBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const gap = parseFloat(getComputedStyle(carousel).columnGap) || 24;
    const slide = carousel.querySelector('.slide').getBoundingClientRect().width;
    const perView = Math.max(1, Math.round((carousel.clientWidth + gap) / (slide + gap)));
    carousel.scrollBy({ left: Number(btn.dataset.dir) * perView * (slide + gap), behavior: 'smooth' });
  });
});
carousel.addEventListener('scroll', updateNav, { passive: true });
window.addEventListener('resize', updateNav);
updateNav();

/* ---------- Projects: click a card to read why it was built ---------- */
const story = document.getElementById('story');
const storyMedia = story.querySelector('.story-media');
const storyBody = story.querySelector('.story-body');
let lastCard = null;

function openStory(card) {
  const tpl = document.getElementById('story-' + card.dataset.project);
  const monitor = card.querySelector('.monitor').cloneNode(true);
  monitor.querySelector('img').removeAttribute('loading');
  storyMedia.replaceChildren(monitor);
  storyBody.replaceChildren(tpl.content.cloneNode(true));
  const heading = storyBody.querySelector('.story-title');
  if (heading) heading.id = 'story-heading';
  lastCard = card;
  story.showModal();
  document.body.classList.add('story-open');
}
document.querySelectorAll('.card-open').forEach((card) => card.addEventListener('click', () => openStory(card)));
story.querySelector('.story-close').addEventListener('click', () => story.close());
story.addEventListener('click', (e) => { if (e.target === story) story.close(); });   // click outside the box
story.addEventListener('close', () => {
  document.body.classList.remove('story-open');
  if (lastCard) lastCard.focus();
});
