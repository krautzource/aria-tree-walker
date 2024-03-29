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
  await page.evaluate(() => {
    document.querySelector('[aria-label="bad tree 2"]').focus();
    document.querySelector('[aria-label="bad tree 3"]').focus();
  });
  t.pass();
});

test('focus and arrow down', pageMacro, async (t, page) => {
  await page.goto('localhost:8080/test/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  const activedescendantId = await page.evaluate(() => {
    return document.activeElement.getAttribute('data-owns-id');
  });
  t.is(activedescendantId, 'treeitem1');
  const treeActivedescendantProp = await page.evaluate(() => {
    return document.activeElement.closest('[role="tree"]').getAttribute('data-activedescendant');
  });
  t.is(treeActivedescendantProp, activedescendantId);
  await page.keyboard.press('Tab');
  const treeActivedescendantPropAfterFocusOut = await page.evaluate(() => {
    return document.querySelector('[aria-label="test tree 1"]').getAttribute('data-activedescendant');
  });
  t.is(treeActivedescendantPropAfterFocusOut, '');
});

test('links: check tabindex', pageMacro, async (t, page) => {
  await page.goto('localhost:8080/test/');
  let tabindex = await page.evaluate(() => {
    return document
      .querySelector('a').getAttribute('tabindex');
  });
  t.is(tabindex, '-1');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowRight');
  tabindex = await page.evaluate(() => {
    return document
      .querySelector('a').getAttribute('tabindex');
  });
  t.is(tabindex, '0');
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

test('links: faux-link', pageMacro, async (t, page) => {
  await page.goto('localhost:8080/test/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Space');
  await page.waitForNavigation({ waitUntil: 'load' });
  const location = await page.evaluate(() => document.location.toString());
  t.is(location, 'https://example.com/');
});

test('highlighting: tree', pageMacro, async (t, page) => {
  await page.goto('localhost:8080/test/');
  await page.keyboard.press('Tab');
  let classnameTree = await page.evaluate(() => document.querySelector('[aria-label="test tree 1"]').className);
  t.is(classnameTree, 'is-highlight is-activedescendant');
  let classnameTreeitem = await page.evaluate(() => document.querySelector('[aria-label="test tree 1"] [data-owns-id="treeitem1"]').className);
  t.is(classnameTreeitem, 'is-highlight');
  let ariahiddenTreeitem = await page.evaluate(() => document.querySelector('[aria-label="test tree 1"] [data-owns-id="treeitem1"]').getAttribute('aria-hidden'));
  t.is(ariahiddenTreeitem, 'true');
  await page.keyboard.press('ArrowDown');
  classnameTree = await page.evaluate(() => document.querySelector('[aria-label="test tree 1"]').className);
  classnameTreeitem = await page.evaluate(() => document.querySelector('[aria-label="test tree 1"] [data-owns-id="treeitem1"]').className)
  t.is(classnameTree, '');
  t.is(classnameTreeitem, 'is-highlight is-activedescendant');
  ariahiddenTreeitem = await page.evaluate(() => document.querySelector('[aria-label="test tree 1"] [data-owns-id="treeitem1"]').hasAttribute('aria-hidden'));
  t.is(ariahiddenTreeitem, false);
  await page.keyboard.press('ArrowUp');
  ariahiddenTreeitem = await page.evaluate(() => document.querySelector('[aria-label="test tree 1"] [data-owns-id="treeitem1"]').getAttribute('aria-hidden'));
  t.is(ariahiddenTreeitem, 'true');
});

test('highlighting: subtreeitem not descendant', pageMacro, async (t, page) => {
  await page.goto('localhost:8080/test/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  const classname = await page.evaluate(() => document.querySelector('[aria-label="test tree 1"] [data-owns-id="treeitem3"]').className);
  t.is(classname, 'is-highlight');
});

test('abort (remove) navigator', pageMacro, async (t, page) => {
  await page.goto('localhost:8080/test/abortSignal.html');
  await page.keyboard.press('Tab');
  // navigate
  await page.keyboard.press('ArrowDown');
  const treeActivedescendantProp = await page.evaluate(() => {
    return document.activeElement.closest('[role="tree"]').getAttribute('data-activedescendant');
  });
  t.is(treeActivedescendantProp, 'treeitem1');
  // abort navigator
  await page.evaluate(() => window.controller.abort());
  // attempt navigation
  await page.keyboard.press('ArrowUp');
  // note failure to navigate
  const treeActivedescendantProp2 = await page.evaluate(() => {
    return document.querySelector('[role="tree"]').getAttribute('data-activedescendant');
  });
  t.is(treeActivedescendantProp2, treeActivedescendantProp);
});
