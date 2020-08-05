const fs = require('fs');
const path = require('path');

const generateOutput = require('./sre-enrich-rewrite');

const main = (texstring) => {
  const out = generateOutput(texstring);

  fs.writeFileSync(
    path.join(__dirname, '..', 'index.html'),
    `<!DOCTYPE html>
<html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>ARIA (owns) Tree walker</title>
      <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <h1>A lightweight walker for labeled aria(-owns) trees</h1>
    <p>For development, this demo requires a browser with support for ES6 modules. Try current Firefox, e.g., with NVDA or JAWS.</p>
    <p><strong>Try this</strong>: focus a diagram (click on it or tab to it), then use the arrow keys. If you're using a screenreader, use browse mode until you encounter a diagram, then switch out of virtual/browse mode to explore with arrow keys. Depending on the screenreader you may have to move the focus to the diagram.</p>
    <h2>A simple diagram</h2>
    <p>The method works for many types of diagrams such as the following simple diagram of a house.</p>
    <figure class="house">
    ${fs.readFileSync(__dirname + '/image.svg')}
      <figcaption>SVG modified from <a href="https://commons.wikimedia.org/wiki/File:House.svg">barretr (Open Clip Art Library) [CC0], via Wikimedia Commons</a>.</figcaption>
    </figure>
    <h2>A chemical diagram</h2>
    <p>A more complex example are diagrams rich of structural information such as the following chemical diagram.</p>
    <figure class="aspirin">
    ${fs.readFileSync(__dirname + '/Aspirin-skeletal.svg')}
      <figcaption>SVG modified from <a href="https://commons.wikimedia.org/wiki/File:Aspirin-skeletal.svg">Originally User:Benjah-bmm27 [Public domain], via Wikimedia Commons</a> with annotations courtesy of <a href="https://progressiveaccess.com/">Progressive Access</a>.</figcaption>
    </figure>
    <h2>An equation in SVG</h2>
    <p>Another typical use case is equational content such as the following SVG describing the solution to the quadratic equation, created with <a href="https://www.mathjax.org">MathJax</a> and <a href="https://github.com/zorkow/speech-rule-engine/">Speech Rule Engine</a> (with additional post-processing, see the doc sources here).</p>
    ${out.svg
      .replace('focusable="false"', '')
      .replace(/data-semantic-(.*?)="(.*?)" /g, '')}
    <h2>An equation in CSS</h2>
    <p>This approach is independent of the markup; here is the same equation laid out using HTML with CSS.</p>
    <style>${out.css}</style>
    ${out.chtml
      .replace(/ aria-hidden="true"/g, '')
      .replace(/data-semantic-(.*?)="(.*?)" /g, '')}
    <script type="module" src="example.js"></script>
  </body>
</html>

`
  );
};

const texstring = process.argv[2];
if (!texstring) console.log('No input texstring; using default');
main(texstring || 'x={-b\\pm\\sqrt{b^2-4ac}\\over2a}');
