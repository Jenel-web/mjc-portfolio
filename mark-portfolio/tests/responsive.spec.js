// Responsiveness audit: loads the page at many screen widths and reports what breaks.
// Browser zoom changes the width the page sees (200% zoom on a 1440px screen = 720px), so these
// widths also cover zooming in and out.
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');

const WIDTHS = [
  { w: 320, h: 640, label: 'small phone' },
  { w: 360, h: 740, label: 'Android phone' },
  { w: 390, h: 844, label: 'iPhone' },
  { w: 430, h: 932, label: 'large phone' },
  { w: 600, h: 960, label: 'small tablet' },
  { w: 768, h: 1024, label: 'tablet' },
  { w: 820, h: 1180, label: 'iPad Air' },
  { w: 1024, h: 768, label: 'small laptop' },
  { w: 1280, h: 800, label: 'laptop' },
  { w: 1440, h: 900, label: 'desktop' },
  { w: 1920, h: 1080, label: 'full HD (or 75% zoom)' },
  { w: 2560, h: 1440, label: 'large monitor (or 50% zoom)' },
];

// Runs inside the page and returns a list of plain-language problems.
function audit() {
  const issues = [];
  const vw = window.innerWidth;
  const label = (el) => {
    const t = (el.innerText || el.getAttribute('aria-label') || el.alt || '').replace(/\s+/g, ' ').trim().slice(0, 36);
    return `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''}${t ? ` "${t}"` : ''}`;
  };
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return false;
    if (el.closest('template, dialog:not([open])')) return false;
    return true;
  };
  const insideStrip = (el) => !!el.closest('.carousel'); // the project strip is clipped on purpose

  // 1. the page must not scroll sideways
  const over = document.documentElement.scrollWidth - vw;
  if (over > 0) issues.push(`Page scrolls sideways by ${over}px`);

  // 2. nothing visible may stick out of the screen
  for (const el of document.querySelectorAll('header *, main *, footer *')) {
    if (!visible(el) || insideStrip(el) || el.closest('.sr-only') || el.classList.contains('sr-only')) continue;
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 || r.left < -1) issues.push(`Sticks out of the screen (${Math.round(r.left)} to ${Math.round(r.right)}px): ${label(el)}`);
  }

  // 3. text that is too small to read
  const small = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.nodeValue.trim()) continue;
    const el = n.parentElement;
    if (!visible(el) || el.closest('.sr-only, script, style')) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 12) small.set(label(el), fs);
  }
  for (const [k, v] of small) issues.push(`Text smaller than 12px (${v}px): ${k}`);

  // 4. tap targets: on touch-sized screens buttons and links need at least 40px
  if (vw <= 820) {
    for (const el of document.querySelectorAll('.btn, .nav-link, .nav-toggle, .social-link, .carousel-btn, .card-open, .story-close, .footer a, .contact a')) {
      if (!visible(el) || insideStrip(el) && !el.classList.contains('card-open')) continue;
      const r = el.getBoundingClientRect();
      if (r.height < 40 || r.width < 40) issues.push(`Hard to tap (${Math.round(r.width)}x${Math.round(r.height)}px): ${label(el)}`);
    }
  }

  // 5. the navigation must not squeeze together
  const menu = document.querySelector('.nav-menu'), cta = document.querySelector('.nav-cta'), logo = document.querySelector('.nav-logo');
  if (menu && cta && visible(menu) && visible(cta) && getComputedStyle(menu).position !== 'fixed') {
    const a = menu.getBoundingClientRect(), b = cta.getBoundingClientRect(), l = logo.getBoundingClientRect();
    if (a.right > b.left - 8) issues.push(`Navigation links run into the "Work With Me" button (gap ${Math.round(b.left - a.right)}px)`);
    if (a.left < l.right + 8) issues.push(`Navigation links run into the logo (gap ${Math.round(a.left - l.right)}px)`);
    const links = menu.querySelector('.nav-links');
    if (links.scrollWidth > links.clientWidth + 1) issues.push('Navigation links do not fit on one row');
  }

  // 6. hero: text and photo must not overlap
  const copy = document.querySelector('.hero-copy'), photo = document.querySelector('.hero-photo');
  if (copy && photo) {
    const a = copy.getBoundingClientRect(), b = photo.getBoundingClientRect();
    const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    if (ox > 12 && oy > 12) issues.push(`Hero text and photo overlap (${Math.round(ox)}x${Math.round(oy)}px)`);
  }
  const name = document.querySelector('.hero-name');
  if (name) {
    const lines = Math.round(name.getBoundingClientRect().height / parseFloat(getComputedStyle(name).lineHeight));
    if (lines > 2) issues.push(`Hero name wraps onto ${lines} lines`);
  }

  // 7. text clipped inside its box (cards, pills, buttons)
  for (const el of document.querySelectorAll('.card *, .pill, .btn, .tag, .banner *')) {
    if (el.closest('.sr-only') || el.classList.contains('sr-only')) continue;
    if (!visible(el) || el.closest('.carousel') && el.closest('.slide') && el.getBoundingClientRect().left > vw) continue;
    if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== 'visible' && el.clientWidth > 0) issues.push(`Text is cut off inside: ${label(el)}`);
  }

  // 8. project cards: all the same size, sensible number per view
  const slides = [...document.querySelectorAll('.slide')].map((s) => Math.round(s.getBoundingClientRect().width));
  if (new Set(slides).size > 1) issues.push(`Project cards have different widths: ${slides.join(', ')}px`);
  const strip = document.querySelector('.carousel');
  if (strip && slides.length) {
    const perView = Math.round((strip.clientWidth + 24) / (slides[0] + 24));
    const wanted = vw >= 760 ? 2 : 1;
    if (perView !== wanted) issues.push(`Shows ${perView} project cards at once, expected ${wanted}`);
    if (slides[0] < 260) issues.push(`Project cards are very narrow (${slides[0]}px)`);
  }

  // 8b. phones: all projects are stacked top to bottom, fully on screen, with no arrow buttons
  if (vw < 760) {
    const sl = [...document.querySelectorAll(".slide")].map((s) => s.getBoundingClientRect());
    if (sl.length !== 5) issues.push(`Expected 5 project cards, found ${sl.length}`);
    if (sl.some((r) => r.left < -1 || r.right > vw + 1)) issues.push("Some project cards are not fully on screen");
    if (sl.some((r, i) => i && r.top < sl[i - 1].bottom - 1)) issues.push("Project cards are not stacked one under the other");
    const nav = document.querySelector(".carousel-nav");
    if (nav && visible(nav)) issues.push("Left and right project buttons are still visible on the phone");
  }

  // 8c. the footer has no Quick links
  if (/quick links/i.test(document.querySelector("footer").innerText)) issues.push("Footer still has Quick links");

  // 9. the order of picture and text: a picture comes before its details on small screens
  const order = (pic, txt) => {
    const p = document.querySelector(pic), t = document.querySelector(txt);
    if (!p || !t) return null;
    return p.getBoundingClientRect().top <= t.getBoundingClientRect().top + 1;
  };
  if (vw < 760) {
    if (order('.hero-photo', '.hero-copy') === false) issues.push('Hero: the picture comes after the details (expected before)');
    if (order('.about-media', '.about-copy') === false) issues.push('About: the picture comes after the details (expected before)');
  }

  // 10. content width: everything sits in the same column on wide screens
  const container = document.querySelector('main .container');
  if (container && vw > 1200) {
    const c = container.getBoundingClientRect();
    if (c.width > 1121) issues.push(`Content column is ${Math.round(c.width)}px wide (max should be 1120px)`);
  }
  return issues;
}

fs.mkdirSync('../playwright-output/screenshots/responsive', { recursive: true });

for (const size of WIDTHS) {
  test(`${size.w}px, ${size.label}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: size.w, height: size.h });
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.waitForTimeout(400);
    const issues = [...new Set(await page.evaluate(audit))];
    await page.screenshot({ path: `../playwright-output/screenshots/responsive/${size.w}-top.png` });
    await page.screenshot({ path: `../playwright-output/screenshots/responsive/${size.w}-full.png`, fullPage: true });
    if (issues.length) testInfo.annotations.push({ type: 'issues', description: issues.join('\n') });
    expect(issues, `\n${size.w}px (${size.label}):\n - ${issues.join('\n - ')}\n`).toEqual([]);
  });
}
