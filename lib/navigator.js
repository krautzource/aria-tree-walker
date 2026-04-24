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
    if (!this.tree) return;
    const options = {};
    if (abortControllerSignal instanceof AbortSignal) options.signal = abortControllerSignal;
    this.node.addEventListener('keydown', this.move.bind(this), options);
    this.node.addEventListener('focusin', (event) => {
      this.enableFocusedNode(event.target.closest('[data-owns-id]') || this.node); // NOTE: root as fallback (and may not have data-owns-id)
    }, options);
  }

  move(event) {
    if (![37, 38, 39, 40].includes(event.keyCode)) {
      return;
    }
    event.preventDefault();
    this.highlight(false);
    switch (event.keyCode) {
      case 37: //left
        this.tree.left();
        break;
      case 38: //up
        this.moveUp();
        break;
      case 39: //right
        this.tree.right();
        break;
      case 40: //down
        this.moveDown();
        break;
      default:
        break;
    }
    this.highlight(true);
    this.tree.active.domnode.focus();
  }

  enableFocusedNode(node) {
    this.highlight(false);
    const name = node.getAttribute('data-owns-id');
    const abstractNode = this.tree.findByName(this.tree.root, name);
    if (node.getAttribute('tabindex') !== '0') { // TODO: use !abstractNode.visible instead?
      // if the node is not yet visible
      let activeAncestor = node.parentNode.closest('[data-owns][tabindex="0"]'); //NOTE: at most, this gets to the root (since enablefocusNode() is called on focus-in)
      if (activeAncestor) {
        while (activeAncestor !== this.node) {
          this.disableNode(activeAncestor);
          activeAncestor = node.closest('[data-owns]');
        };
      }
      else if (node.querySelector('[tabindex="0"]')) {
        let descendant = node.querySelector('[tabindex="0"]').closest('[data-owns]');
        while (descendant !== node) {
          descendant = descendant.closest('[data-owns]');
          this.disableNode(descendant, true)
        }
      }
      this.enableNode(abstractNode);
    }
    this.tree.active = abstractNode;
    this.highlight(true);
  }

  enableNode(abstractNode) {
    const node = abstractNode.domnode;
    node.setAttribute('tabindex', '0');
    node.removeAttribute('aria-hidden');
    node.setAttribute('aria-label', node.getAttribute('data-label'));
    if (node.getAttribute('data-braillelabel')) node.setAttribute('aria-braillelabel', node.getAttribute('data-braillelabel'));
    if (node.tagName !== 'A' || !node.getAttribute('href')) node.setAttribute('role', 'img'); //TODO: revisit after more AT testing
  }

  disableNode(node, needsAriaHidden = false) {
    if (node.tagName === 'A' || node.getAttribute('href')) return;
    node.setAttribute('role', 'none');
    node.removeAttribute('aria-label');
    node.removeAttribute('aria-braillelabel');
    node.removeAttribute('tabindex');
    if (node.hasAttribute('id')) node.setAttribute('tabindex', '-1'); // ensures focus-in event triggers
    if (needsAriaHidden) node.setAttribute('aria-hidden', 'true'); //TODO: do we still need this?
  }

  moveDown() {
    if (!this.tree.active.children.length) return;
    this.disableNode(this.tree.active.domnode, false); // NOTE: could be removed and enableFocusedNode() would still do it
    this.tree.active.children.forEach(this.enableNode);
    this.tree.down();
  }

  moveUp() {
    this.tree.up();
    this.enableNode(this.tree.active);
    this.tree.active.children.forEach(child => this.disableNode(child.domnode, true)); // NOTE: could be removed and enableFocusedNode() would still do it
  }

  //TODO: rewrite to recurse through abstractNode.children?
  highlightSubtree(boolean, node) {
    if (!node) return;
    if (boolean === true) {
      node.classList.add('is-highlight');
    }
    if (boolean === false) {
      node.classList.remove('is-highlight');
    }
    if (!node.getAttribute('data-owns')) return;
    node.getAttribute('data-owns').split(' ').forEach(id => this.highlightSubtree(boolean, this.node.querySelector(`[data-owns-id="${id}"]`)));
  }

  highlight(boolean) {
    const currentNode = this.tree.active.domnode;
    this.highlightSubtree(boolean, currentNode);
    if (boolean === true) {
      currentNode.classList.add('is-activedescendant');
    }
    if (boolean === false) {
      currentNode.classList.remove('is-activedescendant');
    }
  }
}
