export const extractAbstractTree = node =>
  new abstractTree(recurseNodeToExtractTree(node));

/**
 * Recurses through DOM node to create abstract tree.
 * @param {Node} node The target node (with aria-owns attribute).
 */

const recurseNodeToExtractTree = node => {
  if (!node.getAttribute('aria-owns')) {
    return new abstractNode(node.id);
  }
  const parent = new abstractNode(node.id);
  node
    .getAttribute('aria-owns')
    .split(' ')
    .forEach(id => {
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
}
