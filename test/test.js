const sirv = require('sirv');
const polka = require('polka');

const assets = sirv(__dirname + '/../', {
  maxAge: 1,
  immutable: true,
});

polka()
  .use(assets)
  .listen(8080, (err) => {
    if (err) throw err;
  });

const { chromium } = require('playwright');
const test = require('ava').default;
const browserPromise = chromium.launch({
  args: ['--enable-experimental-web-platform-features'],
});

async function pageMacro(t, callback) {
  const browser = await browserPromise;
  const page = await browser.newPage();
  try {
    await callback(t, page);
  } finally {
    await page.close();
  }
}

test('check test setup', pageMacro, async (t, page) => {
  await page.goto('localhost:8080/test/');
  t.is(await page.title(), 'ARIA tree walker Test');
});

test('catch errors', pageMacro, async (t, page) => {
  page.on('pageerror', (exception) => {
    console.log(`Uncaught exception: "${exception}"`);
    t.fail();
  });
  await page.goto('localhost:8080/test/');
  t.pass();
});

test('focus and arrow down', pageMacro, async (t, page) => {
  await page.goto('localhost:8080/test/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  const activedescendantId = await page.evaluate(() => {
    return document.querySelector('[data-treewalker]')
      .ariaActiveDescendantElement.id;
  });
  t.is(activedescendantId, 'treeitem1');
});

test('links: check tabindex', pageMacro, async (t, page) => {
  await page.goto('localhost:8080/test/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowRight');
  const tabindex = await page.evaluate(() => {
    return document
      .querySelectorAll('[data-treewalker]')[1]
      .ariaActiveDescendantElement.getAttribute('tabindex');
  });
  console.log(tabindex);
  t.is(tabindex, '-1');
});

test('links: activating  with ENTER', pageMacro, async (t, page) => {
  await page.goto('localhost:8080/test/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await page.waitForNavigation({ waitUntil: 'load' });
  const location = await page.evaluate(() => document.location.toString());
  t.is(location, 'https://example.com/');
});

test('links: activating with SPACE', pageMacro, async (t, page) => {
  await page.goto('localhost:8080/test/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Space');
  await page.waitForNavigation({ waitUntil: 'load' });
  const location = await page.evaluate(() => document.location.toString());
  t.is(location, 'https://example.com/');
});
