/**
 * Extracts the abstract tree from the DOM node (or a descendant) with aria-owns.
 * @param {Node} node The target node.
 * @param {Tree} abstractTree The abstract tree that stores the relevant (subtree) structure.
 *     node ids.
 */
export const extractAbstractTree = (node) => {
  const treebase = node.hasAttribute('aria-owns')
    ? node
    : node.querySelector('[aria-owns]');
  return new abstractTree(recurseNodeToExtractTree(treebase));
};

/**
 * Recurses through DOM node to create abstract tree.
 * @param {Node} node The target node (with aria-owns attribute).
 */

const recurseNodeToExtractTree = (node) => {
  const parent = new abstractNode(node.id);
  if (node.tagName.toUpperCase() === 'A' && node.getAttribute('href') !== '') {
    parent.href = node.getAttribute('href');
    node.setAttribute('tabindex', '-1');
  }
  if (!node.getAttribute('aria-owns')) {
    return parent;
  }
  node
    .getAttribute('aria-owns')
    .split(' ')
    .forEach((id) => {
      const child = document.getElementById(id);
      const newnode = recurseNodeToExtractTree(child);
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
