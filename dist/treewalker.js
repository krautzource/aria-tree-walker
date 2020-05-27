/**
 * Attaches a navigator to the DOM node.
 * @param {Node} node The target node.
 * @param {Tree} abstractTree The abstract tree that stores the relevant (subtree) structure.
 *     node ids.
 */
function attachNavigator(node, tree) {
  new navigator(node, tree);
}

class navigator {
  constructor(node, tree) {
    this.node = node;
    this.tree = tree;
    this.node.addEventListener('keydown', this.move.bind(this));
    this.node.addEventListener('focusin', this.highlight.bind(this, true));
    this.node.addEventListener('focusout', this.highlight.bind(this, false));
  }

  active() {
    return this.tree.active;
  }

  move(event) {
    this.highlight(false);
    if ([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
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
      default:
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

const extractAbstractTree = node =>
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

const addTreewalker = (node, treebase) => {
  if (!treebase) treebase = node;
  attachNavigator(node, extractAbstractTree(treebase));
};

export { addTreewalker };
