/**
 * Extracts the abstract tree from the DOM node (or a descendant) with aria-owns.
 * @param {Node} node The target node.
 * @param {Tree} abstractTree The abstract tree that stores the relevant (subtree) structure.
 *     node ids.
 */
const extractAbstractTree = (node) => {
  const treebase = node.hasAttribute('aria-owns')
    ? node
    : node.querySelector('[aria-owns]');
  if (!treebase) return console.warn('no aria-owns attribut in tree:', node);
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

/**
 * Attaches a navigator to the DOM node.
 * @param {Node} node The target node.
 */
function attachNavigator(node) {
  new navigator(node);
  node.setAttribute('tabindex', '0');
}

class navigator {
  constructor(node) {
    this.node = node;
    this.tree = extractAbstractTree(node);
    this.node.addEventListener('keydown', this.move.bind(this));
    this.node.addEventListener('focusin', this.highlight.bind(this, true));
    this.node.addEventListener('focusout', this.highlight.bind(this, false));
  }

  active() {
    return this.tree.active;
  }

  move(event) {
    this.highlight(false);
    if ([32, 37, 38, 39, 40, 13, 32].indexOf(event.keyCode) > -1) {
      event.preventDefault();
    }
    switch (event.keyCode) {
      case 37: //left
        this.tree.left();
        break;
      case 38: //up
        this.tree.up();
        break;
      case 39: //right
        this.tree.right();
        break;
      case 40: //down
        this.tree.down();
        break;
      case 32: // space
      case 13: //enter
        this.tree.activateLink();
        break;
    }
    this.highlight(true);
    this.node.setAttribute('aria-activedescendant', this.active().name);
  }

  highlight(boolean) {
    const activedescendant =
      this.active().name === this.node.id
        ? this.node
        : this.node.querySelector('#' + this.active().name);
    if (boolean === true) activedescendant.classList.add('is-activedescendant');
    if (boolean === false)
      activedescendant.classList.remove('is-activedescendant');
  }
}

export { attachNavigator };
