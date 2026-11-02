export type PluginOpKind =
	| "read"
	| "write"
	| "delete"
	| "collection"
	| "index"
	| "meta"
	| "unknown"
	| "control";

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
} as const satisfies Readonly<Record<string, PluginOpKind>>;

/** Every operation name known to the adapter contract. */
export type OpName = keyof typeof OP_KINDS;

/**
 * Operations routed through {@link ValtheraClass.execute}.
 */
export type DbOp = Exclude<
	OpName,
	| "beginTransaction"
	| "commitTransaction"
	| "rollbackTransaction"
	| "capabilities"
>;

export function getOpKind(op: string): PluginOpKind {
	return Object.hasOwn(OP_KINDS, op) ? OP_KINDS[op as OpName] : "unknown";
}

export function isKnownOp(op: string) {
	return Object.hasOwn(OP_KINDS, op);
}

const COLLECTION_OP_KINDS: ReadonlySet<PluginOpKind> = new Set([
	"read",
	"write",
	"delete",
	"index",
]);

/** db[collection][op] */
export function isCollectionOp(op: string) {
	return isKnownOp(op) && COLLECTION_OP_KINDS.has(getOpKind(op));
}

/** db[op] */
export function isDbOp(op: string) {
	return isKnownOp(op) && getOpKind(op) !== "control";
}
