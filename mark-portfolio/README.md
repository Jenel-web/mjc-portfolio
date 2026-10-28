# Mark Jenel Cortas, portfolio

A plain HTML, CSS and JavaScript site. No build step and nothing to install.

## Open it in VS Code

1. Unzip the folder and open it in VS Code (File > Open Folder).
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and choose **Open with Live Server**. The page reloads every time you save.

You can also just double-click `index.html` to open it in a browser.

## Folder layout

```
mark-portfolio/
├── index.html        page content (look for <!-- EDIT --> comments)
├── css/styles.css    all styling; colors and sizes are tokens at the top
├── js/main.js        mobile menu, active nav link, footer year
├── images/           photos, project screenshots, background texture
└── assets/           put resume.pdf here
```

## Things to replace

- `images/profile.svg` and `images/about.svg`: your two photos. Save them as .jpg or .png and update the `src` in `index.html`.
- `images/project-*.svg`: real screenshots of each project (16:10 works best).
- The `href="#"` on each **Live Demo** button: your deployed URLs.
- `assets/resume.pdf`: your resume. The View Resume button opens it in a new tab.
- The bio and "currently learning" tags in the About section.

## Changing the look

- Colors, type sizes, spacing: the tokens in the `:root` block at the top of `css/styles.css`. Fields: ground `--bg`, panels `--surface`, blue `--blue` (footer, hero picture), orange `--accent` (actions and the contact section).
- Texture: the light noise tiles in `images/texture-*-light.svg`. Make them softer by lowering the last alpha numbers in the `feColorMatrix` of each file.
- The name at the top and bottom is fitted to the page width by `js/main.js` (`data-fit`).
- Entrances only play when your system allows animation (Windows: Settings > Accessibility > Visual effects > Animation effects).

## Publishing

Push the folder to a GitHub repo and turn on GitHub Pages, or drag the folder into Netlify or Vercel. It works as is.

## Checking how it looks (Playwright)

Playwright opens the site in a real browser (Chromium) and checks it. It is already installed.

```
npm test             run every check (desktop, tablet, phone, pop-up, buttons, resume)
npm run shots        only take full-page screenshots, saved in ../playwright-output/screenshots/
npm run test:ui      open Playwright's window to watch and re-run checks
npm run test:report  open the last report in your browser
```

The tests are in `tests/portfolio.spec.js`. `npm test` starts the site itself on port 5501, so `npm run dev` can stay running.

### Responsive check

`npm run test:responsive` loads the page at 12 widths (320px phones up to 2560px monitors, which also covers browser zoom) and reports anything that breaks: sideways scrolling, things sticking out, text that is too small, buttons that are hard to tap, the hero name wrapping, project cards of different sizes, and pictures that come after their text on phones.
Results and screenshots are saved in `../playwright-output/` (outside the site folder, so the live server does not reload while tests run).
