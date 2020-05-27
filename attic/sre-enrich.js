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

// TeX to MathML
const TeX = require('mathjax-full/js/input/tex.js').TeX;
const HTMLDocument = require('mathjax-full/js/handlers/html/HTMLDocument.js')
  .HTMLDocument;
const liteAdaptor = require('mathjax-full/js/adaptors/liteAdaptor.js')
  .liteAdaptor;
const STATE = require('mathjax-full/js/core/MathItem.js').STATE;
const AllPackages = require('mathjax-full/js/input/tex/AllPackages.js')
  .AllPackages;
const tex = new TeX({ packages: AllPackages });
const html = new HTMLDocument('', liteAdaptor(), { InputJax: tex });
const MmlVisitor = require('mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js')
  .SerializedMmlVisitor;
const visitor = new MmlVisitor();
const toMathML = node => visitor.visitTree(node, html);

const tex2mml = (string, display) => {
  return toMathML(
    html.convert(string || '', { display: display, end: STATE.CONVERT })
  );
};

// MathML to SVG / CHTML
const mathjax = require('mathjax-full/js/mathjax.js').mathjax;
const MathML = require('mathjax-full/js/input/mathml.js').MathML;
const SVG = require('mathjax-full/js/output/svg.js').SVG;
const CHTML = require('mathjax-full/js/output/chtml.js').CHTML;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const jsdomadaptor = require('mathjax-full/js/adaptors/jsdomAdaptor.js')
  .jsdomAdaptor;
const RegisterHTMLHandler = require('mathjax-full/js/handlers/html.js')
  .RegisterHTMLHandler;
const adaptor = jsdomadaptor(JSDOM);
RegisterHTMLHandler(adaptor);
const mml = new MathML();
const svg = new SVG();
const chtml = new CHTML({
  fontURL:
    'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2/'
});

const svghtml = mathjax.document('', { InputJax: mml, OutputJax: svg });
const chtmlhtml = mathjax.document('', { InputJax: mml, OutputJax: chtml });

const main = async input => {
  const mml = tex2mml(input, true);
  const enriched = sre.toEnriched(mml);
  const mmlpretty = enriched.toString();

  const svgnode = svghtml.convert(mmlpretty, {
    display: true,
    em: 16,
    ex: 8,
    containerWidth: 80 * 16
  });

  const chtmlnode = chtmlhtml.convert(mmlpretty, {
    display: true,
    em: 16,
    ex: 8,
    containerWidth: 80 * 16
  });

  const out = {
    svg: adaptor.outerHTML(svgnode),
    chtml: adaptor.outerHTML(chtmlnode),
    css:
      adaptor.textContent(chtml.styleSheet(chtmlhtml)) + adaptor.textContent(svg.styleSheet(svghtml))
  };
  fs.writeFileSync(
    'index.html',
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
    ${out.chtml.replace(/ aria-hidden="true"/g, '')}
    <p>is really overused as an example.</p>
    <h2>SVG layout</h2>
    <p>The solution to the quadratic equation</p>
    ${out.svg}
    <p>is really overused as an example.</p>
    <h2>A non-equation</h2>
    <p>The same method works for other complex content as well.</p>
    <figure class="house">
    ${fs.readFileSync('image.svg')}
      <figcaption><a href="https://commons.wikimedia.org/wiki/File:House.svg">barretr (Open Clip Art Library) [CC0], via Wikimedia Commons</a></figcaption>
    </figure>
    <h2>A chemical diagram</h2>
    <p>Another example using a chemical diagram.</p>
    <figure class="aspirin">
    ${fs.readFileSync('Aspirin-skeletal.svg')}
      <figcaption><a href="https://commons.wikimedia.org/wiki/File:Aspirin-skeletal.svg">Originally User:Benjah-bmm27 [Public domain], via Wikimedia Commons</a></figcaption>
    </figure>
    <script type="module" src="main.js"></script>
    </body>
    </html>

    `
  );
};

let restart = function() {
  if (!sre.engineReady()) {
    setTimeout(restart, 200);
    return;
  }
  if (!process.argv[2]) {
    console.log('No input as CLI argument; using default');
  }
  main(process.argv[2] || 'x={-b\\pm\\sqrt{b^2-4ac}\\over2a}');
};

restart();
