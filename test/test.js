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

await test('check test setup', async (t) => {
  await page.goto('http://localhost:8080/test/');
  t.assert.equal(await page.title(), 'ARIA tree walker Test');
});

await test('catch errors', async (t) => {
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

await test('Initialization: added rect elements', async (t) => {
  await page.goto('http://localhost:8080/test/');
  let svgString = await page.evaluate(() => {
    return document.querySelector('svg').innerHTML;
  });
  t.assert.equal(svgString,
    `
      <g data-owns-id="treeitem1" data-owns="treeitem3" data-label="item 1.1" aria-hidden="true"><rect x="5" y="5" width="10" height="10" data-rect="true" fill="transparent" stroke="none"></rect><circle cx="10" cy="10" r="5"></circle></g>
      <g data-owns-id="treeitem2" data-label="item 1.2" aria-hidden="true"><rect x="15" y="5" width="10" height="10" data-rect="true" fill="transparent" stroke="none"></rect><circle cx="20" cy="10" r="5"></circle></g>
      <g data-owns-id="treeitem3" data-label="item 1.1.1" aria-hidden="true"><rect x="5" y="15" width="10" height="10" data-rect="true" fill="transparent" stroke="none"></rect><circle cx="10" cy="20" r="5"></circle></g>
    `);
});


await test('In tree, navigating with ArrowDown and ArrowUp', async (t) => {
  await page.goto('http://localhost:8080/test/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  let activedescendantId = await page.evaluate(() => {
    return document.activeElement.getAttribute('data-owns-id');
  });
  t.assert.equal(activedescendantId, 'treeitem1');

  await page.keyboard.press('ArrowUp');
  activedescendantId = await page.evaluate(() => {
    return document.activeElement.getAttribute('data-owns-id');
  });
  t.assert.equal(activedescendantId, 'root');
});


await test('In tree, navigating with ArrowDown on leaf', async (t) => {
  await page.goto('http://localhost:8080/test/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown'); // item 1.1
  await page.keyboard.press('ArrowDown'); // item 1.1.1
  let activedescendantId = await page.evaluate(() => {
    return document.activeElement.getAttribute('data-owns-id');
  });
  t.assert.equal(activedescendantId, 'treeitem3'); //item 1.1.1

  await page.keyboard.press('ArrowDown');
  activedescendantId = await page.evaluate(() => {
    return document.activeElement.getAttribute('data-owns-id');
  });
  t.assert.equal(activedescendantId, 'treeitem3'); // item 1.1.1
});

await test('In tree, navigating with ArrowRight and ArrowLeft', async (t) => {
  await page.goto('http://localhost:8080/test/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowRight');
  let activedescendantId = await page.evaluate(() => {
    return document.activeElement.getAttribute('data-owns-id');
  });
  t.assert.equal(activedescendantId, 'treeitem2');

  await page.keyboard.press('ArrowLeft');
  activedescendantId = await page.evaluate(() => {
    return document.activeElement.getAttribute('data-owns-id');
  });
  t.assert.equal(activedescendantId, 'treeitem1');
});

// tab navigation

await test('In tree, navigating with Tab and Shift+Tab', async (t) => {
  await page.goto('http://localhost:8080/test/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Tab');
  let activedescendantId = await page.evaluate(() => {
    return document.activeElement.getAttribute('data-owns-id');
  });
  t.assert.equal(activedescendantId, 'treeitem2');
  await page.keyboard.down('Shift');
  await page.keyboard.press('Tab');
  await page.keyboard.up('Shift');
  activedescendantId = await page.evaluate(() => {
    return document.activeElement.getAttribute('data-owns-id');
  });
  t.assert.equal(activedescendantId, 'treeitem1');
});

// mix of tab and arrow navigation

// "Cousin" navigation

// click exploration

await page.goto('http://localhost:8080/test/');
await test('In tree, navigating with clicking: click moves down', async (t) => {
  await page.click('[data-owns-id="root"]');
  let activedescendantId = await page.evaluate(() => {
    return document.activeElement.getAttribute('data-owns-id');
  });
  t.assert.equal(activedescendantId, 'treeitem1');
});
await test('In tree, navigating with clicking: tab moves across', async (t) => {
  await page.keyboard.press('Tab');
  let activedescendantId = await page.evaluate(() => {
    return document.activeElement.getAttribute('data-owns-id');
  });
  t.assert.equal(activedescendantId, 'treeitem2');
});
await test('In tree, navigating with clicking: second click on leaf keeps position', async (t) => {
  await page.click('[data-owns-id="treeitem2"]');
  let activedescendantId = await page.evaluate(() => {
    return document.activeElement.getAttribute('data-owns-id');
  });
  t.assert.equal(activedescendantId, 'treeitem2');
});
await test('In tree, navigating with clicking: second click on leaf triggered data-reverse', async (t) => {
  let isReversed = await page.evaluate(() => {
    return document.activeElement.hasAttribute('data-reverse');
  });
  t.assert.ok(isReversed);
});
await test('In tree, navigating with clicking: click on leaf with data-reverse moves up', async (t) => {
  await page.click('[data-owns-id="treeitem2"]');
  let activedescendantId = await page.evaluate(() => {
    return document.activeElement.getAttribute('data-owns-id');
  });
  t.assert.equal(activedescendantId, 'root');
});
await test('In tree, navigating with clicking: reaching root in reverse clears data-reverse', async (t) => {
  let isNotReversed = await page.evaluate(() => {
    return !document.querySelector('[data-reverse]');
  });
  t.assert.ok(isNotReversed);
});


// TODO: deep links

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

await test('teardown', async (t) => {
  await page.close();
  await browser.close();
  await app.server.close();
});
