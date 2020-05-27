import { makeid } from './helpers.mjs';

/**
 * The basic tree for the light walker.
 */

export const makeTree = function(sexp, count) {
  if (!Array.isArray(sexp)) {
    return new node(sexp, makeid(count, sexp));
  }
  let parent = new node(sexp[0], makeid(count, sexp[0]));
  for (let i = 1, child; i < sexp.length; i++) {
    let child = sexp[i];
    let newnode = makeTree(child, count);
    newnode.parent = parent;
    parent.children.push(newnode);
  }
  return parent;
};

class node {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.parent = null;
    this.children = [];
  }
}

export class tree {
  constructor(root, offset) {
    this.root = root;
    this.active = root;
    this.offset = offset;
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
