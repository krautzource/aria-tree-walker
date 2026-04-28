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
    this.node.querySelectorAll('[data-owns-id]').forEach(this.addRect); // better click areas in SVG
    this.node.addEventListener('keydown', this.byKey.bind(this), options);
    this.node.addEventListener('focusin', this.byFocus.bind(this), options);
    this.node.addEventListener('click', this.byClick.bind(this), options);
  }

  byKey(event) {
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

  byFocus(event) {
    const node = event.target.closest('[data-owns-id]') || this.node; // NOTE: root as fallback
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

  byClick(event) {
    const activeAncestor = event.target.closest('[tabindex="0"]');
    if (!activeAncestor) return;
    activeAncestor.focus(); // trigger enableFocusedNode() to prep the tree before responding to click
    this.highlight(false);
    if (
      activeAncestor.hasAttribute('data-reverse') ||
      activeAncestor.querySelector('[data-reverse]')
    ) {
      this.moveUp();
      if (this.tree.active === this.tree.root) // reset when reaching root
        this.node
          .querySelectorAll('[data-reverse]')
          .forEach((node) => node.removeAttribute('data-reverse'));

    }
    else {
      this.moveDown();
      if (!activeAncestor.hasAttribute('data-owns')) activeAncestor.setAttribute('data-reverse', '');
    }
    this.highlight(true);
    this.tree.active.domnode.focus();
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

  /**
   * Recursively toggle .is-highlight
   * @param {Boolean} boolean 
   * @param {AbstractNode} abstractNode 
   * @returns 
   */
  highlightSubtree(boolean, abstractNode) {
    abstractNode.domnode.classList.toggle('is-highlight', boolean);
    abstractNode.children.forEach(this.highlightSubtree.bind(this, boolean));
  }

  /**
   * Toggle highlighting
   * @param {Boolean} boolean 
   */
  highlight(boolean) {
    this.highlightSubtree(boolean, this.tree.active);
    this.tree.active.domnode.classList.toggle('is-activedescendant', boolean);
  }

  /**
  * Adds rect elements to g elements to increase surface area
  * @param {HTMLElement} node
  * @returns 
  */
  addRect(node) {
    if (node.tagName !== 'g') return;
    const bbox = node.getBBox();
    node.insertAdjacentHTML(
      'afterbegin',
      `<rect x="${bbox.x}" y="${bbox.y}" width="${bbox.width}" height="${bbox.height}" data-rect="true" fill="transparent" stroke="none"/>`
    );
  }
}
