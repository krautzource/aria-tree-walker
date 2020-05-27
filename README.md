# aria-tree-walker

A lightweight walker for labeled aria(-owns) trees.

Reads the aria-owns structure of an aria tree where every node is labeled. Provides a breadth-first tree walker using arrow keys. AT users will get the full label in browse mode and can switch into focus mode to explore (on almost all major browser+AT combinations).

## History and prior art

An initial prototype was developed during the AIM workshop [Web accessibility of mathematics](https://aimath.org/pastworkshops/webmath.html). Much of the code was (and still is) based on prior work in [MathJax](https://github.com/mathjax/MathJax), [speech rule engine](https://github.com/zorkow/speech-rule-engine/issues), and [ChromeVox](http://www.chromevox.com/) (part of [Chromium](https://www.chromium.org/)).

This prototype was further developed into [MathJax SRE Walker](https://github.com/krautzource/mathjax-sre-walker), a lightweight walker for server-side generated mathjax rendering.

From there, it evolved from SRE-specific markup to a general purpose aria(-owns) tree walker and forked. The goal is to support any such tree (e.g., diagrammatic content).
