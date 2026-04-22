import test from 'node:test';
import sirv from 'sirv';
import polka from 'polka';
const __dirname = import.meta.dirname;

import puppeteer from 'puppeteer';

const assets = sirv(__dirname + '/../', {
  maxAge: 1,
  immutable: true,
});

const app = polka()
app
  .use(assets)
  .listen(8080, (err) => {
    if (err) throw err;
  });

const browser = await puppeteer.launch({
  args: ['--enable-experimental-web-platform-features'],
});

const page = await browser.newPage();

test('check test setup', async (t) => {
  await page.goto('http://localhost:8080/test/');
  t.assert.equal(await page.title(), 'ARIA tree walker Test');
});

test('catch errors', async (t) => {
  page.on('pageerror', (exception) => {
    console.log(`Uncaught exception: "${exception}"`);
    t.assert.fail();
  });
  await page.goto('http://localhost:8080/test/');
  await page.evaluate(() => {
    document.querySelector('[aria-label="bad tree 2"]').focus();
    document.querySelector('[aria-label="bad tree 3"]').focus();
  });
  t.assert.ok(true);
});

test('focus and arrow down', async (t) => {
  await page.goto('http://localhost:8080/test/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  const activedescendantId = await page.evaluate(() => {
    return document.activeElement.getAttribute('data-owns-id');
  });
  t.assert.equal(activedescendantId, 'treeitem1');
});

await test('links: activating  with ENTER', async (t) => {
  await page.goto('http://localhost:8080/test/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await page.waitForNavigation({ waitUntil: 'load' });
  const location = await page.evaluate(() => document.location.toString());
  t.assert.equal(location, 'https://example.com/');
});

await test('highlighting: tree', async (t) => {
  await page.goto('http://localhost:8080/test/');
  await page.keyboard.press('Tab');
  let classnameTree = await page.evaluate(() => document.querySelector('[data-label="test tree 1"]').className);
  t.assert.equal(classnameTree, 'is-highlight is-activedescendant');
  let classnameTreeitem = await page.evaluate(() => document.querySelector('[data-label="test tree 1"] [data-owns-id="treeitem1"]').className);
  t.assert.equal(classnameTreeitem, 'is-highlight');
  let ariahiddenTreeitem = await page.evaluate(() => document.querySelector('[data-label="test tree 1"] [data-owns-id="treeitem1"]').getAttribute('aria-hidden')); //NOTE: this is (now) simply checking that the HTML source (which should start with aria-hidden) has not been changed at this stage
  t.assert.equal(ariahiddenTreeitem, 'true');
  await page.keyboard.press('ArrowDown');
  classnameTree = await page.evaluate(() => document.querySelector('[data-label="test tree 1"]').className);
  classnameTreeitem = await page.evaluate(() => document.querySelector('[data-label="test tree 1"] [data-owns-id="treeitem1"]').className)
  t.assert.equal(classnameTree, '');
  t.assert.equal(classnameTreeitem, 'is-highlight is-activedescendant');
  ariahiddenTreeitem = await page.evaluate(() => document.querySelector('[data-label="test tree 1"] [data-owns-id="treeitem1"]').hasAttribute('aria-hidden'));
  t.assert.equal(ariahiddenTreeitem, false);
  await page.keyboard.press('ArrowUp');
  ariahiddenTreeitem = await page.evaluate(() => document.querySelector('[data-label="test tree 1"] [data-owns-id="treeitem1"]').getAttribute('aria-hidden'));
  t.assert.equal(ariahiddenTreeitem, 'true');
});

await test('highlighting: subtreeitem not descendant', async (t) => {
  await page.goto('http://localhost:8080/test/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  const classname = await page.evaluate(() => document.querySelector('[data-owns-id="root"] [data-owns-id="treeitem3"]').className);
  t.assert.equal(classname, 'is-highlight');
});

await test('abort (remove) navigator', async (t) => {
  await page.goto('http://localhost:8080/test/abortSignal.html');
  await page.keyboard.press('Tab');
  // navigate
  await page.keyboard.press('ArrowDown');
  const treeActivedescendantProp = await page.evaluate(() => {
    return document.activeElement.getAttribute('data-owns-id');
  });
  t.assert.equal(treeActivedescendantProp, 'treeitem1');
  // abort navigator
  await page.evaluate(() => window.controller.abort());
  // attempt navigation
  await page.keyboard.press('ArrowUp');
  // note failure to navigate
  const treeActivedescendantProp2 = await page.evaluate(() => {
    return document.querySelector('[data-owns-id="root"]').getAttribute('role');
  });
  t.assert.equal(treeActivedescendantProp2, 'none');
});

test('teardown', async (t) => {
  await page.close();
  await browser.close();
  await app.server.close();
});
