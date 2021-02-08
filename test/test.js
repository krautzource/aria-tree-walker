const sirv = require('sirv');
const polka = require('polka');

const assets = sirv(__dirname+'/../', {
  maxAge: 1,
  immutable: true
});

polka()
  .use(assets)
  .listen(8080, err => {
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


test('focus and arrow down', pageMacro, async (t, page) => {
    await page.goto('localhost:8080/test/');
    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowDown');
    const activedescendantId = await page.evaluate( () => { return document.querySelector('[data-treewalker]').ariaActiveDescendantElement.id });
    t.is(activedescendantId, 'treeitem1');
  });
