const { test, expect } = require('@playwright/test');

// Screen sizes to check: a laptop, a tablet and a phone.
const sizes = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'phone', width: 390, height: 844 },
];

for (const size of sizes) {
  test.describe(`${size.name} (${size.width}px)`, () => {
    test.use({ viewport: { width: size.width, height: size.height } });

    test('page loads and nothing sticks out sideways', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('h1')).toContainText('Mark Jenel');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, 'page should not scroll sideways').toBeLessThanOrEqual(0);
    });

    test('every image loads', async ({ page }) => {
      await page.goto('/');
      // lazy images only load when scrolled to, so scroll through the page first
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); }
        window.scrollTo(0, 0);
      });
      const broken = await page.evaluate(() =>
        [...document.images].filter((i) => !(i.complete && i.naturalWidth > 0)).map((i) => i.getAttribute('src')));
      expect(broken, 'images that failed to load').toEqual([]);
    });

    test('full-page screenshot', async ({ page }) => {
      await page.goto('/');
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(500);
      await page.screenshot({ path: `../playwright-output/screenshots/${size.name}-full.png`, fullPage: true });
    });
  });
}

test.describe('project pop-up', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('opens on click, closes with X and by clicking outside, and is gone when closed', async ({ page }) => {
    await page.goto('/');
    const story = page.locator('#story');
    await expect(story).toBeHidden();                       // closed pop-up must not show on the page

    await page.locator('.card-open[data-project="countdown"]').click();
    await expect(story).toBeVisible();
    await expect(story.locator('.story-title')).toHaveText('Countdown Math Arena');
    await page.screenshot({ path: '../playwright-output/screenshots/popup-countdown.png' });

    await story.locator('.story-close').click();           // X closes it
    await expect(story).toBeHidden();

    await page.locator('.card-open[data-project="countdown"]').click();
    await expect(story).toBeVisible();
    await page.mouse.click(20, 450);                        // click on the dark area outside the box
    await expect(story).toBeHidden();
  });

  test('left and right buttons move the project cards', async ({ page }) => {
    await page.goto('/');
    const strip = page.locator('#carousel');
    const prev = page.locator('.carousel-btn[data-dir="-1"]');
    const next = page.locator('.carousel-btn[data-dir="1"]');
    await expect(prev).toBeDisabled();
    await next.click();
    await expect.poll(() => strip.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
    await expect(prev).toBeEnabled();
  });
});

test('resume button downloads a file', async ({ page }) => {
  await page.goto('/');
  const resume = page.locator('a[download]').first();
  await expect(resume).toHaveAttribute('href', 'assets/resume.pdf');
  // The link only works once assets/resume.pdf exists.
  const res = await page.request.get('/assets/resume.pdf');
  expect(res.ok(), 'assets/resume.pdf is missing, so the resume button would be broken').toBeTruthy();
});
