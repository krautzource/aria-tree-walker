# aria-tree-walker

A lightweight walker for labeled aria(-owns) trees.

Reads the aria-owns structure of an aria tree where every node is labeled. Provides a breadth-first tree walker using arrow keys. AT users will get the full label in browse mode and can switch into focus mode to explore (on almost all major browser+AT combinations).

## Usage

The module currently exports a function that expects a (well-prepared) DOM node:

```js
import { attachNavigator } from 'aria-tree-walker';

const myNode = document.querySelector('...');
attachNavigator(myNode);
```

The navigator extracts an abtract tree of the aria-owns relationships which is used to provide keyboard navigation and (accessible) focus management, i.e., active-descendant management.

The active descendant will get a class of `is-activedescendant` for (visual) styling purposes.

## Content expectations

Some rough expectations to get meaningful results from your content:

- The DOM node **must** either have an aria-owns attribute or have a descendant with an aria-owns attribute (which will serve as de-facto root - having a wrapping node around the "real" aria-owns root can make things easier for authoring/design).
- The DOM node **must** be focusable, e.g., have `tabindex="0"`. (While it won't throw an error, it will not work without focus.)
- The "aria-owns tree" **should** be "full", i.e., navigation stops at owned elements without aria-owns attribute. (Could be refined in the future.)
- Each node with aria-owns attribute **should** have suitable roles and ARIA markup, e.g., `role="tree"` and `role="treeitem"` as well as an `aria-label` with a suitable accessible name (to get a "flat" name).
- Visual highlighting is handled by author CSS using `.is-activedescendant`. (This could be refined in the future.)

## User Experience

Upon focus (e.g., clicking on or tabbing to an element with attached walker), the node will be highlighted and become explorable using the arrow keys. If you're using a screenreader, use browse mode until you encounter the node, then switch out of virtual/browse mode to explore with arrow keys. Some screenreader and browser combinations fail to put the current node into focus so you may have to move the focus to the equation.

Authors must ensure that these features are discoverable, e.g., via an explainer in the content / UI or via specific indicators on the element (e.g., one-time hints via live-region, description, role description).

## Examples

See `./docs` for examples using simple diagrams, chemical diagrams, and (server-side) equation rendering with MathJax.

## History and prior art

An initial prototype was developed during the AIM workshop [Web accessibility of mathematics](https://aimath.org/pastworkshops/webmath.html). Much of the code was (and still is) based on prior work in [MathJax](https://github.com/mathjax/MathJax), [speech rule engine](https://github.com/zorkow/speech-rule-engine/issues), and [ChromeVox](http://www.chromevox.com/) (part of [Chromium](https://www.chromium.org/)). That prototype was further developed into [MathJax SRE Walker](https://github.com/krautzource/mathjax-sre-walker), a lightweight walker for server-side generated mathjax rendering.

From there, the walker evolved from SRE-specific markup to a general purpose aria(-owns) tree walker. At that point, it was forked to this repository and continued as aria-tree-walker. The goal is to support any such tree (e.g., complex diagrammatic content) and to gradually improve the user experience.
