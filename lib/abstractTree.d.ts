export function extractAbstractTree(node: Node): abstractTree;
declare class abstractTree {
    /**
     *
     * @param {abstractNode} root
     */
    constructor(root: abstractNode);
    root: abstractNode;
    active: abstractNode;
    up(): void;
    down(): void;
    left(): void;
    right(): void;
    /**
     *
     * @param {abstractNode} abstractNode
     * @param {Function} filterfuncton - to test if abstractNode is a match for the search
     * @param {Boolean} inReverse - if true, search children in reverse order
     * @returns
     */
    search(abstractNode: abstractNode, filterfuncton: Function, inReverse?: boolean): any;
    /**
     *
     * @param {abstractNode} abstractNode
     * @param {String} name - the name of a descendant abstractNode
     * @returns
     */
    findByName(abstractNode: abstractNode, name: string): any;
    /**
     * Finds the next visible "cousin" node (which may be a sibling)
     * @param {abstractNode} abstractNode
     * @param {Boolean} inReverse - move left/right
     * @returns
     */
    findNextVisibleCousin(abstractNode: abstractNode, inReverse?: boolean): abstractNode;
}
/**
 * The basic tree for the light walker.
 */
declare class abstractNode {
    /**
     * @constructor
     * @param {HTMLElement} node
     */
    constructor(node: HTMLElement);
    domnode: HTMLElement;
    visible: boolean;
    name: string | null;
    parent: any;
    children: any[];
}
export {};
