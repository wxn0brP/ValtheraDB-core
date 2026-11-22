export type PluginOpKind = "read" | "write" | "delete" | "collection" | "index" | "meta" | "unknown" | "control";
export declare const OP_KINDS: {
    readonly find: "read";
    readonly findOne: "read";
    readonly count: "read";
    readonly add: "write";
    readonly bulkAdd: "write";
    readonly update: "write";
    readonly updateOne: "write";
    readonly updateOneOrAdd: "write";
    readonly toggleOne: "write";
    readonly remove: "delete";
    readonly removeOne: "delete";
    readonly ensureCollection: "collection";
    readonly issetCollection: "collection";
    readonly removeCollection: "collection";
    readonly createIndex: "index";
    readonly removeIndex: "index";
    readonly getCollections: "meta";
    readonly capabilities: "meta";
    readonly beginTransaction: "control";
    readonly commitTransaction: "control";
    readonly rollbackTransaction: "control";
};
/** Every operation name known to the adapter contract. */
export type OpName = keyof typeof OP_KINDS;
/**
 * Operations routed through {@link ValtheraClass.execute}.
 */
export type DbOp = Exclude<OpName, "beginTransaction" | "commitTransaction" | "rollbackTransaction" | "capabilities">;
export declare function getOpKind(op: string): PluginOpKind;
export declare function isKnownOp(op: string): boolean;
/** db[collection][op] */
export declare function isCollectionOp(op: string): boolean;
/** db[op] */
export declare function isDbOp(op: string): boolean;
