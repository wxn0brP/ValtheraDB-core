export const OP_KINDS = {
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
    return Object.hasOwn(OP_KINDS, op) ? OP_KINDS[op] : "unknown";
}
export function isKnownOp(op) {
    return Object.hasOwn(OP_KINDS, op);
}
const COLLECTION_OP_KINDS = new Set([
    "read",
    "write",
    "delete",
    "index",
]);
/** db[collection][op] */
export function isCollectionOp(op) {
    return isKnownOp(op) && COLLECTION_OP_KINDS.has(getOpKind(op));
}
/** db[op] */
export function isDbOp(op) {
    return isKnownOp(op) && getOpKind(op) !== "control";
}
