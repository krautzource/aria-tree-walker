import { extractAbstractTree } from './abstractTree.mjs';

/**
 * Attaches a navigator to the DOM node.
 * @param {Node} node The target node.
 */
export function attachNavigator(node) {
  new navigator(node);
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
