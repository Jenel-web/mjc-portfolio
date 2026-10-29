const { test, expect } = require('@playwright/test');

const MAIL = 'markjenelcortas29@gmail.com';

test.describe('Work With Me pop-up', () => {
  test.use({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });

  test('every "Work With Me" button opens it, and Esc, X and clicking outside close it', async ({ page }) => {
    await page.goto('/');
    const dialog = page.locator('#reach');
    await expect(dialog).toBeHidden();                        // closed means gone, nothing at the page bottom

    const buttons = page.locator('[data-contact-open]');
    expect(await buttons.count()).toBe(7);                    // 3 buttons, plus the email icons and email addresses
    for (let i = 0; i < 7; i++) {
      await buttons.nth(i).scrollIntoViewIfNeeded();
      await buttons.nth(i).click();
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('heading')).toContainText('project');
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
    }

    await buttons.first().click();
    await dialog.locator('.reach-close').click();             // X
    await expect(dialog).toBeHidden();

    await buttons.first().click();
    await page.mouse.click(15, 450);                          // on the dark area outside the box
    await expect(dialog).toBeHidden();
  });

  test('main button opens Gmail with my address in the To box, plus a subject and starter message', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-contact-open]').first().click();
    const gmail = page.locator('#reach .reach-gmail');
    const url = new URL(await gmail.getAttribute('href'));
    expect(url.origin + url.pathname).toBe('https://mail.google.com/mail/');
    expect(url.searchParams.get('view')).toBe('cm');               // the compose window
    expect(url.searchParams.get('to')).toBe(MAIL);
    expect(url.searchParams.get('su')).toContain('work together');
    expect(url.searchParams.get('body')).toContain('Hi Mark');
    await expect(gmail).toHaveAttribute('target', '_blank');
    // a second choice for people who use Outlook or Apple Mail
    const other = await page.locator('#reach .reach-mail').getAttribute('href');
    expect(other.startsWith(`mailto:${MAIL}?`)).toBeTruthy();
  });

  test('copy button copies the email address and says so', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-contact-open]').first().click();
    const copy = page.locator('#reach .reach-copy');
    await expect(copy).toContainText('Copy');
    await copy.click();
    await expect(copy).toContainText('Copied');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(MAIL);
    await expect(copy).toContainText('Copy email', { timeout: 4000 });   // goes back after a moment
  });

  test('LinkedIn link opens in a new tab, and the email icons and addresses open the pop-up (with a plain email link as backup)', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-contact-open]').first().click();
    const li = page.locator('#reach .reach-linkedin');
    await expect(li).toHaveAttribute('href', /linkedin\.com\/in\//);
    await expect(li).toHaveAttribute('target', '_blank');
    await page.keyboard.press('Escape');
    for (const sel of ['.hero .social a[data-contact-open]', '.banner-email', 'footer .footer-email[data-contact-open]', 'footer .social a[data-contact-open]']) {
      const el = page.locator(sel).first();
      expect(await el.getAttribute('href'), sel).toContain(`mailto:${MAIL}`);   // backup if scripts are off
      await el.scrollIntoViewIfNeeded();
      await el.click();
      await expect(page.locator('#reach'), sel).toBeVisible();
      await page.keyboard.press('Escape');
    }
  });

  test('it fits on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto('/');
    await page.locator('.hero a.btn[data-contact-open]').click();
    const box = await page.locator('#reach').boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(360);
    expect(box.y + box.height).toBeLessThanOrEqual(640);
    await page.screenshot({ path: '../playwright-output/screenshots/reach-phone.png' });
  });
});
