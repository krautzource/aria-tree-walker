/**
 * Extracts the abstract tree from the DOM node (or a descendant) with data-owns.
 * @param {Node} node The target node.
 * @returns {abstractTree} The abstract tree that stores the relevant (subtree) structure.
 */
export const extractAbstractTree = (node) => {
  const treebase = node.hasAttribute('data-owns')
    ? node
    : node.querySelector('[data-owns]');
  if (!treebase) return console.warn('aria-tree-walker: no data-owns attribute in:', node);
  return new abstractTree(recurseNodeToExtractTree(treebase, treebase));
};

/**
 * Recurses through DOM node to create abstract tree.
 * @param {Node} treebase The root of the (data-owns) tree.
 * @param {Node} node An owned node of the treebase (with data-owns-id and possibly data-owns attribute).
 * @returns {abstractNode} An abstract tree node.
 */

const recurseNodeToExtractTree = (treebase, node) => {
  const parent = new abstractNode(node);
  const owns = node.getAttribute('data-owns');
  if (!owns) {
    return parent;
  }
  owns.split(' ').forEach((id) => {
    const child = treebase.querySelector(`[data-owns-id="${id}"]`);
    if (!child) {
      console.warn('aria-tree-walker: no child with data-owns-id', id);
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
  /**
   * @constructor
   * @param {HTMLElement} node 
   */
  constructor(node) {
    this.domnode = node;
    this.visible = false;
    this.name = node.getAttribute('data-owns-id');
    this.parent = null;
    this.children = [];
  }
}

class abstractTree {
  /**
   * 
   * @param {abstractNode} root 
   */
  constructor(root) {
    this.root = root;
    this.active = root;
    this.root.visible = true;
  }
  up() {
    if (!this.active.parent) return; // case: root
    this.active = this.active.parent;
    this.active.visible = true;
    this.active.children.forEach(child => child.visible = false);
  }

  down() {
    if (!this.active.children.length) return; // case: leaf
    this.active.visible = false;
    this.active.children.forEach(child => child.visible = true);
    this.active = this.active.children[0];
  }

  left() {
    if (!this.active.parent) return; // case: root
    const inReverse = true;
    this.active = this.findNextVisibleCousin(this.active, inReverse);
  }

  right() {
    if (!this.active.parent) return; // case: root
    this.active = this.findNextVisibleCousin(this.active);
  }

  /**
   * 
   * @param {abstractNode} abstractNode 
   * @param {Function} filterfuncton - to test if abstractNode is a match for the search
   * @param {Boolean} inReverse - if true, search children in reverse order
   * @returns 
   */
  search(abstractNode, filterfuncton, inReverse = false) {
    if (filterfuncton(abstractNode)) return abstractNode;
    if (!abstractNode.children) return null;
    const maybeReversedChildren = inReverse ? abstractNode.children.toReversed() : abstractNode.children;
    for (let child of maybeReversedChildren) {
      let result = this.search(child, filterfuncton, inReverse);
      if (result) return result;
    }
  }

  /**
   * 
   * @param {abstractNode} abstractNode
   * @param {String} name - the name of a descendant abstractNode
   * @returns 
   */
  findByName(abstractNode, name) {
    const filter = (node) => (node.name === name);
    return this.search(abstractNode, filter);
  }

  /**
   * Finds the next visible "cousin" node (which may be a sibling)
   * @param {abstractNode} abstractNode 
   * @param {Boolean} inReverse - move left/right
   * @returns 
   */
  findNextVisibleCousin(abstractNode, inReverse = false) {
    let result = abstractNode;
    const move = inReverse ? -1 : 1; // move left or right across the tree
    let theNode = abstractNode;
    let theParent = abstractNode.parent;
    let ancestorSibling = null;
    while (theParent) { // move through ancestors to find proper (ancestor) siblings
      const index = theParent.children.indexOf(theNode);
      const hasSibling = inReverse ? (index !== 0) : (index !== theParent.children.length - 1);
      if (hasSibling) {
        ancestorSibling = theParent.children[index + move];
        break;
      }
      theNode = theParent;
      theParent = theParent.parent;
    }
    result = ancestorSibling ? this.search(ancestorSibling, node => node.visible, inReverse) : abstractNode;
    return result;
  }
}
