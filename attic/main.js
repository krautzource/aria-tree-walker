import { rewriteNode } from './rewritenode.mjs';
import { attachNavigator } from './lib/navigator.mjs';
import { makeTree, tree } from './tree.mjs';

/**
 * Generates tree structure from skeleton
 * @param {Node} node The target node.
 * @param {number} count The counter that helps to disambiguate the semantic
 *     node ids.
 */
const rewriteSkeleton = function(node, count) {
  let skeleton = node.getAttribute('data-semantic-structure');
  let replaced = skeleton
    .replace(/\(/g, '[')
    .replace(/\)/g, ']')
    .replace(/ /g, ',');
  let linearization = JSON.parse(replaced);
  let navigationStructure = makeTree(linearization, count);
  return new tree(navigationStructure, count);
};

const moveAttribute = (oldnode, newnode, attribute) => {
  const value = oldnode.getAttribute(attribute);
  if (!value) return;
  newnode.setAttribute(attribute, value);
  oldnode.removeAttribute(attribute);
}

document
  .querySelectorAll('[data-semantic-structure]')
  .forEach((node, index) => {
    node.setAttribute('tabindex', '0');
    node.setAttribute('role', 'tree');
    let tree = rewriteSkeleton(node, index);
    rewriteNode(node, tree);
    node.querySelectorAll('*').forEach( child => {if(!child.getAttribute('role')) child.setAttribute('role', 'presentation')});
    // HACK cf. #39
    const svg = node.closest('svg');
    if (svg && svg !== node){
      ['aria-owns', 'aria-label', 'role', 'tabindex'].forEach(moveAttribute.bind(null, node, svg));
      attachNavigator(svg, tree);
    }
    else attachNavigator(node, tree);
  });
