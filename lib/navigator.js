import { extractAbstractTree } from './abstractTree.js';

/**
 * Attaches a navigator to the DOM node.
 * @param {Node} node - The target node.
 * @param {AbortSignal} [abortControllerSignal] - An (optional) signal from an AbortController.
 */
export function attachNavigator(node, abortControllerSignal) {
  new navigator(node, abortControllerSignal);
  node.setAttribute('tabindex', '0');
}

class navigator {
  constructor(node, abortControllerSignal) {
    this.node = node;
    this.tree = extractAbstractTree(node);
    const options = {};
    if (abortControllerSignal instanceof AbortSignal) options.signal = abortControllerSignal;
    this.node.addEventListener('keydown', this.move.bind(this), options);
    this.node.addEventListener('focusin', () => {
      this.node.setAttribute('tabindex', '-1');
      this.highlight(true);
    }, options);
    this.node.addEventListener('focusout', () => {
      this.highlight(false);
      this.node.setAttribute('tabindex', '0');
    }, options);
  }

  active() {
    return this.tree.active;
  }

  move(event) {
    if (![32, 37, 38, 39, 40, 13, 32].includes(event.keyCode)) {
      return;
    }
    event.preventDefault();
    this.highlight(false);
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
      default:
        break;
    }
    this.highlight(true);
  }

  highlightSubtree(boolean, node) {
    if (!node) return;
    if (boolean === true) {
      node.classList.add('is-highlight');
    }
    if (boolean === false) {
      node.classList.remove('is-highlight');
    }
    if (!node.getAttribute('data-owns')) return;
    node.setAttribute('aria-hidden', 'true'); // NOTE for the active node, highlight() will remove it again
    node.getAttribute('data-owns').split(' ').forEach(id => this.highlightSubtree(boolean, this.node.querySelector(`[data-owns-id="${id}"]`)));
  }

  highlight(boolean) {
    const activedescendant =
      this.active().name === this.node.getAttribute('data-owns-id')
        ? this.node
        : this.node.querySelector(`[data-owns-id="${this.active().name}"]`);
    this.highlightSubtree(boolean, activedescendant);
    if (boolean === true) {
      activedescendant.setAttribute('tabindex', '0');
      activedescendant.classList.add('is-activedescendant');
      this.node.setAttribute('data-activedescendant', this.active().name);
      activedescendant.focus();
    }
    if (boolean === false) {
      activedescendant.setAttribute('tabindex', '-1');
      activedescendant.classList.remove('is-activedescendant');
      this.node.setAttribute('data-activedescendant', "");
    }
    activedescendant.removeAttribute('aria-hidden'); // NOTE was added by highlightSubtree()
  }
}
