import { attachNavigator } from './navigator.mjs';
import { extractAbstractTree } from './abstractTree.mjs';

export const addTreewalker = (node, treebase) => {
  if (!treebase) treebase = node;
  attachNavigator(node, extractAbstractTree(treebase));
};
