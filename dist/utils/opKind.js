const OP_KINDS = {
    find: "read",
    findOne: "read",
    count: "read",
    add: "write",
    bulkAdd: "write",
    update: "write",
    updateOne: "write",
    updateOneOrAdd: "write",
    toggleOne: "write",
    remove: "delete",
    removeOne: "delete",
    ensureCollection: "collection",
    issetCollection: "collection",
    removeCollection: "collection",
    createIndex: "index",
    removeIndex: "index",
    getCollections: "meta",
    capabilities: "meta",
    beginTransaction: "control",
    commitTransaction: "control",
    rollbackTransaction: "control",
};
export function getOpKind(op) {
    return Object.hasOwn(OP_KINDS, op) ? OP_KINDS[op] : "write";
}
export function isKnownOp(op) {
    return Object.hasOwn(OP_KINDS, op);
}
export function isMutation(kind) {
    return kind === "write" || kind === "delete";
}
export function isCollectionOp(op) {
    return getOpKind(op) === "collection";
}
export function isIndexOp(op) {
    return getOpKind(op) === "index";
}
export function isMetaOp(op) {
    return getOpKind(op) === "meta";
}
export function isControlOp(op) {
    return getOpKind(op) === "control";
}
export function isNoQueryOp(op) {
    const kind = getOpKind(op);
    return kind === "collection" || kind === "meta";
}
