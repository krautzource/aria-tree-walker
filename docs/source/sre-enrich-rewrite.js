const sre = require('speech-rule-engine');
sre.setupEngine({
  domain: 'mathspeak',
  style: 'default',
  locale: 'en',
  speech: 'deep',
  structure: true,
  mode: 'sync',
});
sre.engineReady();

const rewrite = require('@krautzource/sre-to-tree');

// TeX to MathML
const TeX = require('mathjax-full/js/input/tex.js').TeX;
const HTMLDocument = require('mathjax-full/js/handlers/html/HTMLDocument.js')
  .HTMLDocument;
const liteAdaptor = require('mathjax-full/js/adaptors/liteAdaptor.js')
  .liteAdaptor;
const STATE = require('mathjax-full/js/core/MathItem.js').STATE;
const AllPackages = require('mathjax-full/js/input/tex/AllPackages.js')
  .AllPackages.filter(x => x !== 'bussproofs'); // NOTE bussproofs needs getBBox() method
const tex = new TeX({ packages: AllPackages, tagSide: 'left', });
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
    'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2'
});

const svghtml = mathjax.document('', { InputJax: mml, OutputJax: svg });
const chtmlhtml = mathjax.document('', { InputJax: mml, OutputJax: chtml });

  // crossing the streams... cf. zorkow/speech-rule-engine#438
const crossingStreams = (brailleDoc, node) => {
  node.setAttribute(
    'data-semantic-braille',
    brailleDoc
      .querySelector(
        '[data-semantic-id="' + node.getAttribute('data-semantic-id') + '"]'
      )
      .getAttribute('data-semantic-speech')
  );
}

module.exports = (input) => {
  const mml = tex2mml(input, true);
  const enriched = sre.toEnriched(mml);
  const mmlpretty = enriched.toString();

  // switch SRE to Braille
  sre.setupEngine({
    domain: 'default',
    style: 'default',
    locale: 'nemeth',
    modality: 'braille',
    speech: 'deep',
    structure: true,
    mode: 'sync',
  });
  sre.engineReady();
  const enrichedMmlBraille = sre.toEnriched(mml).toString();
  const dom = new JSDOM(`<!DOCTYPE html>${enrichedMmlBraille}`);
  const brailleDoc = dom.window.document;

  const svgnode = svghtml.convert(mmlpretty, {
    display: true,
    em: 16,
    ex: 8,
    containerWidth: 80 * 16
  });

  svgnode.querySelectorAll('[data-semantic-speech]').forEach(crossingStreams.bind(null, brailleDoc));
  rewrite(svgnode.firstElementChild);

  const chtmlnode = chtmlhtml.convert(mmlpretty, {
    display: true,
    em: 16,
    ex: 8,
    containerWidth: 80 * 16
  });

  chtmlnode.querySelectorAll('[data-semantic-speech]').forEach(crossingStreams.bind(null, brailleDoc));
  rewrite(chtmlnode);

  return {
    svg: adaptor.outerHTML(svgnode),
    chtml: adaptor.outerHTML(chtmlnode),
    css:
      adaptor.textContent(chtml.styleSheet(chtmlhtml)) +
      adaptor.textContent(svg.styleSheet(svghtml))
  };
};
