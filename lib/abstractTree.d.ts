export function extractAbstractTree(node: Node): void | abstractTree;
declare class abstractTree {
    constructor(root: any);
    root: any;
    active: any;
    up(): void;
    down(): void;
    left(): void;
    right(): void;
    activateLink(): void;
}
export {};
