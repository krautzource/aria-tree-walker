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
      <title>ARIA Tree walker</title>
      <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <h1>A lightweight walker for labeled ARIA trees</h1>
    <p>This demo requires a browser with support for ES6 modules; anything not IE should work. Other builds of this library are available, see <a href="https://github.com/krautzource/">github.com/krautzource/aria-tree-walker</a>.</p>
    <p>For screenreader users, any recent release should work, e.g., NVDA, JAWS, Orca; for VoiceOver the instructions work on non-Safari browsers. On mobile, ARIA trees are not well supported in general.</p>
    <p><strong>Try this</strong>: focus a diagram (click on it or tab to it), then use the arrow keys. If you're using a screenreader, use browse mode until you encounter a diagram, then switch out of virtual/browse mode to explore with arrow keys. Depending on the screenreader you may have to move the focus to the diagram.</p>
    <p>If you are <strong>not</strong> a screenreader user, use the options below to get similar results.</p>
    <fieldset>
      <legend>Options for non-screenreader user</legend>
      <div>
        <input type="checkbox" id="speechSynth" name="speechSynth">
        <label for="speechSynth">Speech Synthesis</label>
      </div>
      <div>
        <input type="checkbox" id="subtitle" name="enableSubtitle">
        <label for="subtitle">Subtitles</label>
      </div>
    </fieldset>
  
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
    <h2>A diagram created with D3.js</h2>
    <p>Another typical use case are diagrams created with D3 such as the simple (pre-rendered) tree diagram below. Of course it is also possible to <a href="./d3/">do this client-side</a>.</p>
    <svg data-treewalker="" id="d3" role="tree" aria-label="A simple tree diagram about encyclopedia structure" aria-description="Focus to navigate with arrow keys." data-owns="encyclopedia" width="300" height="300"><g transform="translate(-40,40)"><path class="link" d="M128.57142857142856,100C128.57142857142856,0 171.42857142857142,100 171.42857142857142,0"></path><path class="link" d="M214.28571428571428,100C214.28571428571428,0 171.42857142857142,100 171.42857142857142,0"></path><path class="link" d="M85.71428571428571,200C85.71428571428571,100 128.57142857142856,200 128.57142857142856,100"></path><path class="link" d="M171.42857142857142,200C171.42857142857142,100 128.57142857142856,200 128.57142857142856,100"></path><g class="node node--internal" data-owns-id="encyclopedia" role="treeitem" aria-level="1" aria-label="encyclopedia" data-owns="culture science" transform="translate(171.42857142857142,0)"><circle r="2.5"></circle><text dy="-1em" x="36" style="text-anchor: end;">encyclopedia</text></g><g class="node node--internal" data-owns-id="culture" role="treeitem" aria-level="2" aria-label="culture" data-owns="art craft" transform="translate(128.57142857142856,100)"><circle r="2.5"></circle><text dy="-1em" x="21" style="text-anchor: end;">culture</text></g><g class="node node--leaf" data-owns-id="science" role="treeitem" aria-level="2" aria-label="science" data-owns="" transform="translate(214.28571428571428,100)"><circle r="2.5"></circle><text dy="0.3em" x="8" style="text-anchor: start;">science</text></g><g class="node node--leaf" data-owns-id="art" role="treeitem" aria-level="3" aria-label="art" data-owns="" transform="translate(85.71428571428571,200)"><circle r="2.5"></circle><text dy="0.3em" x="8" style="text-anchor: start;">art</text></g><g class="node node--leaf" data-owns-id="craft" role="treeitem" aria-level="3" aria-label="craft" data-owns="" transform="translate(171.42857142857142,200)"><circle r="2.5"></circle><text dy="0.3em" x="8" style="text-anchor: start;">craft</text></g></g></svg>
    <h2>Musical score</h2>
    <p>This technique can also be applied to other structured content such as musical scores, see this <a href="./music/">simple example score</a>.</p>
    <h2>An equation in SVG</h2>
    <p>Another typical use case is equational content such as the following SVG describing the solution to the quadratic equation, created with <a href="https://www.mathjax.org">MathJax</a> and <a href="https://github.com/zorkow/speech-rule-engine/">Speech Rule Engine</a> (with additional post-processing, see the doc sources here).</p>
    ${out.svg
      .replace('role="tree"', 'role="tree" data-treewalker')
      .replace('focusable="false"', '')
      .replace(/data-semantic-(.*?)="(.*?)" /g, '')}
    <h2>An equation in CSS</h2>
    <p>This approach is independent of the markup; here is the same equation laid out using HTML with CSS.</p>
    <style>${out.css}</style>
    ${out.chtml
      .replace('role="tree"', 'role="tree" data-treewalker')
      .replace(/ aria-hidden="true"/g, '')
      .replace(/data-semantic-(.*?)="(.*?)" /g, '')}

    <h2>A tikz diagram</h2>
    <p>It is also possible to leverage tikz for this purpose, combining special macros with dvisvgm. The following is a simple tree diagram; you can find the TeX source in the repository's docs folder.</p>
    ${fs.readFileSync(__dirname + '/../tikz/tree.svg').toString().replace('<![CDATA[', '').replace(']]>', '').replace('<?xml version=\'1.0\' encoding=\'UTF-8\'?>', '').replace('<svg', '<svg data-treewalker="" id="tikz"')}
    <script type="module" src="example.js"></script>
    <script>
        const speechObserver = new MutationObserver(function(mutationRecordArray) {
        if (mutationRecordArray.length < 1) return;
        const activeTree = mutationRecordArray[0].target;
        const activeDescendant = activeTree.querySelector('[data-owns-id="'+activeTree.getAttribute('data-activedescendant')+'"]') || activeTree;
        if (!activeDescendant || activeDescendant !== document.activeElement) {
          window.speechSynthesis.cancel();
          return;
        }
        if (!activeDescendant.getAttribute('aria-label')) return;
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
        let ssu = new SpeechSynthesisUtterance(activeDescendant.getAttribute('aria-label'));
        window.speechSynthesis.speak(ssu);
      });
      const speechConnect = () => document.querySelectorAll('[data-treewalker]').forEach(node => speechObserver.observe(node, {subtree: false, attributeFilter: ['data-activedescendant']}));

      document.getElementById('speechSynth').addEventListener('click',  () => {
        if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
        if (document.getElementById('speechSynth').checked) {
        speechConnect(); 
        return;
        } 
        speechObserver.disconnect(); 
        })

      const subtitle = document.createElement('div');
      subtitle.setAttribute('aria-hidden', 'true');
      subtitle.setAttribute('style', 'position: fixed; bottom:0; left: 0; background-color: black; color: white; max-width: 100%');      
      document.body.appendChild(subtitle);

      subtitleObserver = new MutationObserver(function(mutationRecordArray) {
        if (mutationRecordArray.length < 1) return;
        const activeTree = mutationRecordArray[0].target;
        const activeDescendant = activeTree.querySelector('[data-owns-id="'+activeTree.getAttribute('data-activedescendant')+'"]') || activeTree;
        if (!activeDescendant || activeDescendant !== document.activeElement || !activeDescendant.getAttribute('aria-label')) {
          subtitle.innerHTML  = '';
          return;
        }
        subtitle.innerHTML  = activeDescendant.getAttribute('aria-label');
        // const activeTree = activeDescendant.closest('[data-treewalker]');
        // const rect = activeTree.getBoundingClientRect();
        // subtitle.style.bottom = (window.innerHeight - rect.bottom - subtitle.scrollHeight)+'px';
        // subtitle.style.left = rect.left+'px';
        // subtitle.style.width = rect.width+'px';
        // console.log(rect)
      });

      const subtitleConnect = () => document.querySelectorAll('[data-treewalker]').forEach(node => subtitleObserver.observe(node, {subtree: false, attributeFilter: ['data-activedescendant']}));

      document.getElementById('subtitle').addEventListener('click',  () => {
        document.getElementById('subtitle').checked ? subtitleConnect() : subtitleObserver.disconnect();
      })

      document.addEventListener("visibilitychange", function() {
        if (document.visibilityState  !== 'visible') window.speechSynthesis.cancel();
      })
    </script>
  </body>
</html>

`
  );
};

const texstring = process.argv[2];
if (!texstring) console.log('No input texstring; using default');
main(texstring || '\\begin{equation}x={-b\\pm\\sqrt{b^2-4ac}\\over2a} \\tag{1} \\end{equation}');
