const fs = require('fs');
const sre = require('speech-rule-engine');
sre.setupEngine({
  domain: 'mathspeak',
  style: 'default',
  locale: 'en',
  speech: 'deep',
  structure: true,
  mode: 'sync'
});
sre.engineReady();

const generateOutput = require('./sre-enrich-rewrite');

const main = texstring => {
  const out = generateOutput(sre, texstring);

  fs.writeFileSync(
    '../index.html',
    `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>MathJax-SRE-walker</title>
          <link rel="stylesheet" href="style.css">
      </head>
      <body>
      <h1>A lightweight walker for equation layout</h1>
      <p>For development, this demo requires a browser with support for ES6 modules. Try current Firefox, e.g., with NVDA or JAWS.</p>
      <p><strong>Try this</strong>: focus an equation (click on it or tab to it), then use the arrow keys. If you're using a screenreader, use browse mode until you hear an equation, then switch out of virtual/browse mode to explore with arrow keys. Depending on the screenreader you may have to move the focus to the equation.</p>
      <h2>CSS layout</h2>
      <p>The solution to the quadratic equation</p>
      <style>${out.css}</style>
      ${out.chtml
        .replace(/ aria-hidden="true"/g, '')
        .replace(/data-semantic-(.*?)="(.*?)" /g, '')}
      <p>is really overused as an example.</p>
      <h2>SVG layout</h2>
      <p>The solution to the quadratic equation</p>
      ${out.svg
        .replace('focusable="false"', '')
        .replace(/data-semantic-(.*?)="(.*?)" /g, '')}
      <p>is really overused as an example.</p>
      <h2>A non-equation</h2>
      <p>The same method works for other complex content as well.</p>
      <figure class="house">
      ${fs.readFileSync('./image.svg')}
        <figcaption><a href="https://commons.wikimedia.org/wiki/File:House.svg">barretr (Open Clip Art Library) [CC0], via Wikimedia Commons</a></figcaption>
      </figure>
      <h2>A chemical diagram</h2>
      <p>Another example using a chemical diagram.</p>
      <figure class="aspirin">
      ${fs.readFileSync('./Aspirin-skeletal.svg')}
        <figcaption><a href="https://commons.wikimedia.org/wiki/File:Aspirin-skeletal.svg">Originally User:Benjah-bmm27 [Public domain], via Wikimedia Commons</a></figcaption>
      </figure>
      <script type="module" src="example.js"></script>
      </body>
      </html>

      `
  );
};

// HACK cf. zorkow/speech-rule-engine#247
let restart = function() {
  if (!sre.engineReady()) {
    setTimeout(restart, 200);
    return;
  }
  const texstring = process.argv[2];
  if (!texstring) console.log('No input texstring; using default');
  main(texstring || 'x={-b\\pm\\sqrt{b^2-4ac}\\over2a}');
};

restart();
