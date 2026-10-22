export type PluginOpKind = "read" | "write" | "delete" | "collection" | "index" | "meta" | "control";
export declare function getOpKind(op: string): PluginOpKind;
export declare function isKnownOp(op: string): boolean;
export declare function isMutation(kind: PluginOpKind): kind is "delete" | "write";
export declare function isCollectionOp(op: string): boolean;
export declare function isIndexOp(op: string): boolean;
export declare function isMetaOp(op: string): boolean;
export declare function isControlOp(op: string): boolean;
export declare function isNoQueryOp(op: string): boolean;
