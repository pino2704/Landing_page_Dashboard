async (page) => {
  const failures = [];
  const browserErrors = [];
  const resourceErrors = [];
  const results = [];
  const check = (condition, label) => { if (!condition) failures.push(label); };
  page.on('pageerror', error => browserErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') browserErrors.push(message.text()); });
  page.on('response', response => { if (response.status() >= 400) resourceErrors.push(response.url() + ': ' + response.status()); });
  page.on('requestfailed', request => resourceErrors.push(request.url() + ': ' + request.failure().errorText));

  for (const width of [1440, 768, 390, 375]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('http://127.0.0.1:4173/');
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    check(await page.locator('main > section').count() === 8, width + ': eight sections');
    check(await page.locator('h1').innerText() === 'Từ dữ liệu phân tán\nđến quản trị chủ động', width + ': headline');

    const invalidAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links.filter(link => !document.querySelector(link.getAttribute('href'))).map(link => link.outerHTML));
    check(invalidAnchors.length === 0, width + ': anchor targets');
    check(await page.locator('form').count() === 0, width + ': no unconnected form');
    check(await page.locator('img[src*="admin_preview"]').count() === 0, width + ': admin image excluded');

    if (width < 768) {
      await page.getByRole('button', { name: 'Mở menu', exact: true }).click();
      check(await page.locator('#mobile-menu').isVisible(), width + ': mobile menu opens');
      await page.keyboard.press('Escape');
      check(!await page.locator('#mobile-menu').isVisible(), width + ': Escape closes menu');
      await page.getByRole('button', { name: 'Mở menu', exact: true }).click();
      await page.locator('#mobile-menu').getByRole('link', { name: 'Xếp hạng đại học', exact: true }).click();
      check(!await page.locator('#mobile-menu').isVisible(), width + ': menu closes after navigation');
    } else {
      await page.locator('.desktop-nav').getByRole('link', { name: 'Xếp hạng', exact: true }).click();
    }
    check(await page.locator('#panel-ranking').isVisible(), width + ': navigation selects ranking tab');
    await page.locator('#tab-ranking').focus();
    await page.keyboard.press('ArrowRight');
    check(await page.locator('#panel-admin').isVisible(), width + ': keyboard advances tab');
    check(await page.locator('#panel-admin .process-step').count() === 3, width + ': admin process');
    await page.keyboard.press('Home');
    check(await page.locator('#panel-accreditation').isVisible(), width + ': Home selects first tab');
    await page.keyboard.press('ArrowLeft');
    check(await page.locator('#panel-admin').isVisible(), width + ': tab wraps left');
    await page.keyboard.press('Home');

    await page.getByRole('button', { name: 'Danh sách hồ sơ', exact: true }).click();
    check((await page.locator('#panel-accreditation img').getAttribute('src')).endsWith('DB_WEB_03_program_detail.png'), width + ': accreditation gallery');
    await page.locator('#panel-accreditation [data-lightbox]').click();
    check(await page.locator('#lightbox').isVisible(), width + ': lightbox opens');
    await page.locator('#lightbox-image').evaluate(img => img.decode());
    await page.getByRole('button', { name: 'Xem 100%', exact: true }).click();
    const zoom = await page.locator('#lightbox-image').evaluate(img => ({ width: img.getBoundingClientRect().width, natural: img.naturalWidth }));
    check(Math.abs(zoom.width - zoom.natural) < 2, width + ': natural-size zoom');
    await page.keyboard.press('Tab');
    check(await page.evaluate(() => document.querySelector('#lightbox').contains(document.activeElement)), width + ': lightbox focus remains inside');
    await page.keyboard.press('Escape');
    check(!await page.locator('#lightbox').isVisible(), width + ': Escape closes lightbox');
    check(await page.locator('#panel-accreditation [data-lightbox]').evaluate(el => document.activeElement === el), width + ': focus restored');
    await page.locator('#panel-accreditation [data-lightbox]').click();
    await page.getByRole('button', { name: 'Đóng ảnh', exact: true }).click();
    check(!await page.locator('#lightbox').isVisible(), width + ': close button');

    await page.locator('#tab-ranking').click();
    await page.getByRole('button', { name: 'InCites & bài báo', exact: true }).click();
    check((await page.locator('#panel-ranking img').getAttribute('src')).endsWith('DB_WEB_04_ranking_InCitesPaper.png'), width + ': InCites gallery');
    await page.locator('#panel-ranking img').evaluate(img => img.decode());
    const walkImages = ['DB_WEB_01_accreditation_overview.png', 'DB_WEB_06_alerts.png', 'DB_WEB_03_program_detail.png', 'DB_WEB_06_alerts.png'];
    for (let step = 0; step < 4; step++) {
      await page.locator('[data-walk-step="' + step + '"]').click();
      check(await page.locator('[data-walk-step="' + step + '"]').getAttribute('aria-pressed') === 'true', width + ': walkthrough state ' + step);
      check((await page.locator('#walk-panel img').getAttribute('src')).endsWith(walkImages[step]), width + ': walkthrough image ' + step);
      await page.locator('#walk-panel img').evaluate(img => img.decode());
    }
    await page.locator('#walk-panel summary').click();
    check(await page.locator('#walk-context').isVisible(), width + ': screenshot context opens');
    check((await page.locator('#walk-context').innerText()).includes('đơn vị chuyên môn'), width + ': plan is human action');
    await page.locator('#walk-panel summary').click();
    const summaries = page.locator('.faq-item summary');
    for (let index = 1; index < 5; index++) {
      await summaries.nth(index).click();
      check(await page.locator('.faq-item[open]').count() === 1, width + ': one accordion open ' + index);
    }
    await summaries.nth(4).focus();
    await page.keyboard.press('Enter');
    check(await page.locator('.faq-item[open]').count() === 0, width + ': keyboard closes accordion');
    await page.getByRole('link', { name: 'Xem lại các tính năng', exact: true }).click();
    check(new URL(page.url()).hash === '#DB-S03', width + ': final CTA');
    const anchorPosition = await page.evaluate(() => ({ section: document.querySelector('#DB-S03').getBoundingClientRect().top, header: document.querySelector('.site-header').getBoundingClientRect().bottom }));
    check(anchorPosition.section >= anchorPosition.header - 1, width + ': anchor clears sticky navigation');

    for (const section of await page.locator('main > section').all()) await section.scrollIntoViewIfNeeded();
    const geometry = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      broken: [...document.querySelectorAll('img[src]')].filter(img => img.getClientRects().length && (!img.complete || !img.naturalWidth)).map(img => img.src),
      distorted: [...document.querySelectorAll('img[src]')].filter(img => img.getClientRects().length && Math.abs(img.getBoundingClientRect().width / img.getBoundingClientRect().height - img.naturalWidth / img.naturalHeight) > .02).map(img => img.src),
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      animation: getComputedStyle(document.querySelector('.hero-visual')).animationName,
      fontLoaded: document.fonts.check('16px "Be Vietnam Pro"')
    }));
    check(!geometry.overflow, width + ': no horizontal overflow');
    check(geometry.broken.length === 0, width + ': images load');
    check(geometry.distorted.length === 0, width + ': images retain aspect ratio');
    check(geometry.scrollBehavior === 'auto' && geometry.animation === 'none', width + ': reduced motion');
    check(geometry.fontLoaded, width + ': local font loaded');
    results.push({ width, ...geometry });

    await page.goto('http://127.0.0.1:4173/');
    await page.evaluate(() => document.fonts.ready);
    for (const section of await page.locator('main > section').all()) await section.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: 'output/playwright/desktop-' + width + '.png', fullPage: true });
    await page.screenshot({ path: 'output/playwright/hero-' + width + '.png' });
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  check(browserErrors.length === 0, 'No console or uncaught errors: ' + browserErrors.join('; '));
  check(resourceErrors.length === 0, 'No failed resources: ' + resourceErrors.join('; '));
  if (failures.length) throw new Error(failures.join('\n'));
  return { results, browserErrors, resourceErrors, failures };
}
