export type PluginOpKind =
	| "read"
	| "write"
	| "delete"
	| "collection"
	| "index"
	| "meta"
	| "control";

const OP_KINDS: Readonly<Record<string, PluginOpKind>> = {
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

export function getOpKind(op: string): PluginOpKind {
	return Object.hasOwn(OP_KINDS, op) ? OP_KINDS[op] : "write";
}

export function isKnownOp(op: string) {
	return Object.hasOwn(OP_KINDS, op);
}

export function isMutation(kind: PluginOpKind) {
	return kind === "write" || kind === "delete";
}

export function isCollectionOp(op: string) {
	return getOpKind(op) === "collection";
}

export function isIndexOp(op: string) {
	return getOpKind(op) === "index";
}

export function isMetaOp(op: string) {
	return getOpKind(op) === "meta";
}

export function isControlOp(op: string) {
	return getOpKind(op) === "control";
}

export function isNoQueryOp(op: string) {
	const kind = getOpKind(op);
	return kind === "collection" || kind === "meta";
}
