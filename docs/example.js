import { addTreewalker } from '../dist/treewalker.js';

document
  .querySelectorAll('[data-treewalker]')
  .forEach((node) => {
    let treebase = node.hasAttribute('aria-owns') ? node : node.querySelector('[aria-owns]');
    addTreewalker(node, treebase);
  });
