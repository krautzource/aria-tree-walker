/**
 * Extracts the abstract tree from the DOM node (or a descendant) with data-owns.
 * @param {Node} node The target node.
 * @returns {Tree} abstractTree The abstract tree that stores the relevant (subtree) structure.
 *     node ids.
 */
export const extractAbstractTree = (node) => {
  const treebase = node.hasAttribute('data-owns')
    ? node
    : node.querySelector('[data-owns]');
  if (!treebase) return console.warn('no data-owns attribute in tree:', node);
  return new abstractTree(recurseNodeToExtractTree(treebase, treebase));
};

/**
 * Recurses through DOM node to create abstract tree.
 * @param {Node} treebase The root of the (data-owns) tree.
 * @param {Node} node An owned node of the treebase (with data-owns-id and possibly data-owns attribute).
 * @returns {abstractNode} An abstract tree node.
 */

const recurseNodeToExtractTree = (treebase, node) => {
  const parent = new abstractNode(node.getAttribute('data-owns-id'));
  if (node.tagName.toUpperCase() === 'A' && node.hasAttribute('href')) {
    parent.href = node.getAttribute('href');
    node.setAttribute('tabindex', '-1');
  }
  const owns = node.getAttribute('data-owns');
  if (!owns) {
    return parent;
  }
  owns.split(' ').forEach((id) => {
    const child = treebase.querySelector(`[data-owns-id="${id}"]`);
    if (!child) {
      console.warn('no child with data-owns-id', id);
      return;
    }
    const newnode = recurseNodeToExtractTree(treebase, child);
    newnode.parent = parent;
    parent.children.push(newnode);
  });
  return parent;
};

/**
 * The basic tree for the light walker.
 */

class abstractNode {
  constructor(name) {
    this.name = name;
    this.parent = null;
    this.href = null;
    this.children = [];
  }
}

class abstractTree {
  constructor(root) {
    this.root = root;
    this.active = root;
  }

  up() {
    if (this.active.parent) {
      this.active = this.active.parent;
    }
  }

  down() {
    if (this.active.children.length) {
      this.active = this.active.children[0];
    }
  }

  left() {
    if (this.active.parent) {
      let index = this.active.parent.children.indexOf(this.active);
      if (index > 0) {
        this.active = this.active.parent.children[index - 1];
      }
    }
  }

  right() {
    if (this.active.parent) {
      let index = this.active.parent.children.indexOf(this.active);
      if (index < this.active.parent.children.length - 1) {
        this.active = this.active.parent.children[index + 1];
      }
    }
  }

  activateLink() {
    if (this.active.href) {
      window.location.href = this.active.href;
    }
  }
}
