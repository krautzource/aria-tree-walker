const crypto = require('crypto');

function generateId(hash, id) {
  return 'MJX-' + hash + '-' + id;
}
const generateLabelAndRole = function (node) {
  if (node.hasAttribute('data-semantic-speech')) {
    let speech = '';
    if (node.getAttribute('data-semantic-prefix'))
      speech += node.getAttribute('data-semantic-prefix') + ' ';
    speech += node.getAttribute('data-semantic-speech');
    node.setAttribute('aria-label', speech);
    if (
      node.hasAttribute('role') ||
      node.tagName === 'A' ||
      node.tagName === 'IMAGE'
    )
      return;
    node.setAttribute('role', 'treeitem');
  } else {
    node.setAttribute('role', 'presentation');
  }
};

/**
 * Rewrites the DOM node.
 * @param {Node} node The DOM node to rewrite.
 * @param {hash} hash The hash used to ensure unique IDs.
 */
function rewriteNode(hash, node) {
  node.setAttribute(
    'id',
    generateId(hash, node.getAttribute('data-semantic-id'))
  );
  generateLabelAndRole(node);
  const owned = node.getAttribute('data-semantic-owns');
  if (!owned) return;
  const combinedSemanticChildrenIDs = owned.split(' ');
  node.setAttribute(
    'aria-owns',
    combinedSemanticChildrenIDs.map(generateId.bind(null, hash)).join(' ')
  );
  combinedSemanticChildrenIDs
    .map((id) => node.querySelector('[data-semantic-id="' + id + '"'))
    .forEach(rewriteNode.bind(null, hash));
}

const moveAttribute = (oldnode, newnode, attribute) => {
  if (!oldnode || !newnode || oldnode === newnode) return;
  const value = oldnode.getAttribute(attribute);
  if (!value) return;
  newnode.setAttribute(attribute, value);
  oldnode.removeAttribute(attribute);
};

const rewrite = (node) => {
  const skeletonNode = node.querySelector(
    '[data-semantic-children][data-semantic-speech]'
  );
  const hash = crypto.createHash('md5').update(node.outerHTML).digest('hex');
  node.setAttribute('tabindex', '0');
  node.setAttribute('role', 'tree');
  node.setAttribute('data-treewalker', '');
  rewriteNode(hash, skeletonNode);
  skeletonNode.querySelectorAll('*').forEach((child) => {
    if (!child.getAttribute('role')) child.setAttribute('role', 'presentation');
  });
  // HACK cf. #39
  const svg = skeletonNode.closest('svg');
  ['aria-owns', 'aria-label', 'role', 'tabindex', 'data-treewalker'].forEach(
    moveAttribute.bind(null, skeletonNode, svg)
  );
  return node;
};

module.exports = rewrite;
