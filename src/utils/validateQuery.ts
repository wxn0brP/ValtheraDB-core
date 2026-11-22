import { QueryValidationError } from "../errors";
import { VQuery } from "../types/query";
import { SEARCH_OPERATOR_NAMES } from "./hasFieldsAdvanced";
import { isUnsafeKey } from "./security";
import { UPDATE_OPERATOR_NAMES } from "./updateOperators";

const SEARCH_OPS = new Set([
	"$and",
	"$or",
	"$not",
	"$subset",
	...SEARCH_OPERATOR_NAMES,
]);

const UPDATE_OPS = new Set(UPDATE_OPERATOR_NAMES);

function isObject(value: unknown): value is Record<string, any> {
	return typeof value === "object" && value !== null;
}

function isOperatorValue(value: unknown): value is Record<string, any> {
	return isObject(value) && !Array.isArray(value);
}

function isDataObject(value: unknown): value is Record<string, any> {
	return isObject(value) && !Array.isArray(value);
}

function fail(message: string, key: string, op: string): never {
	throw new QueryValidationError(message, {
		op,
		key,
	});
}

const REQUIRED_FIELDS: Record<string, string[]> = {
	find: [
		"search",
	],
	findOne: [
		"search",
	],
	count: [
		"search",
	],
	update: [
		"search",
		"updater",
	],
	updateOne: [
		"search",
		"updater",
	],
	updateOneOrAdd: [
		"search",
		"updater",
	],
	remove: [
		"search",
	],
	removeOne: [
		"search",
	],
	toggleOne: [
		"search",
	],
	createIndex: [
		"index",
	],
	removeIndex: [
		"index",
	],
};

export function validateSearch(search: unknown) {
	if (search === undefined || search === null) return;
	if (!isOperatorValue(search))
		fail("Search must be an object", "search", "search");
	checkSearch(search);
}

function checkSearch(search: Record<string, any>) {
	let hasAnd = false;
	let hasOr = false;

	for (const [key, value] of Object.entries(search)) {
		if (isUnsafeKey(key)) continue;
		if (key.charCodeAt(0) !== 36) continue;
		const op = key.toLowerCase();
		if (!SEARCH_OPS.has(op)) continue;

		if (op === "$and" || op === "$or") {
			if (!Array.isArray(value)) fail(`${key} must be an array`, key, "search");
			if (op === "$and") hasAnd = true;
			else hasOr = true;
			for (const item of value) {
				if (!isOperatorValue(item))
					fail("Search condition must be an object", key, "search");
				checkSearch(item);
			}
			continue;
		}

		if (op === "$not") {
			if (!isOperatorValue(value))
				fail("$not must be an object", key, "search");
			checkSearch(value);
			continue;
		}

		if (op === "$subset") {
			if (!isOperatorValue(value))
				fail("$subset must be an object", key, "search");
			continue;
		}

		if (!isOperatorValue(value))
			fail(`${key} requires an object value`, key, "search");
		checkFields(op, value, "search");
	}

	if (hasAnd && hasOr)
		fail("$and and $or cannot be used at the same level", "$and", "search");
}

export function validateUpdater(updater: unknown) {
	if (updater === undefined || updater === null) return;
	if (!isOperatorValue(updater))
		fail("Updater must be an object", "updater", "update");

	for (const [key, value] of Object.entries(updater)) {
		if (isUnsafeKey(key)) continue;
		if (key.charCodeAt(0) !== 36) continue;
		const op = key.toLowerCase();
		if (!UPDATE_OPS.has(op) || op === "$deepmerge") continue;
		if (!isOperatorValue(value))
			fail(`${key} requires an object value`, key, "update");
		checkFields(op, value, "update");
	}
}

function checkFields(
	op: string,
	fields: Record<string, any>,
	kind: "search" | "update",
) {
	for (const [key, value] of Object.entries(fields)) {
		if (isUnsafeKey(key)) continue;
		if (isOperatorValue(value) && !(value instanceof RegExp)) {
			checkFields(op, value, kind);
			continue;
		}
		const reason =
			kind === "search"
				? searchValueError(op, value)
				: updateValueError(op, value);
		if (reason) fail(`${op} ${reason}`, key, kind);
	}
}

function searchValueError(op: string, value: unknown) {
	switch (op) {
		case "$in":
		case "$nin":
		case "$arrinc":
		case "$arrincall":
			return Array.isArray(value) ? null : "requires an array";
		case "$between":
			return Array.isArray(value) &&
				value.length === 2 &&
				typeof value[0] === "number" &&
				typeof value[1] === "number"
				? null
				: "requires [min, max]";
		case "$regex":
			return value instanceof RegExp ? null : "requires a RegExp";
		default:
			return null;
	}
}

function updateValueError(op: string, value: unknown) {
	switch (op) {
		case "$pushall":
		case "$pullall":
			return Array.isArray(value) ? null : "requires an array";
		case "$rename":
			return typeof value === "string" ? null : "requires a string";
		default:
			return null;
	}
}

export function validateQuery(query: VQuery | string | undefined, op?: string) {
	if (!query || typeof query === "string") return;
	const q = query as Record<string, any>;

	if (op !== "getCollections" && !q.collection)
		fail('Missing "collection"', "collection", "query");

	for (const field of (op && REQUIRED_FIELDS[op]) || []) {
		if (q[field] === undefined || q[field] === null)
			fail(`Missing required field "${field}"`, field, "query");
	}

	validateAdd(q, op);
	validateBulkAdd(q, op);

	if (q.search !== undefined && q.search !== null) validateSearch(q.search);
	if (q.updater !== undefined && q.updater !== null) validateUpdater(q.updater);
}

function validateAdd(q: Record<string, any>, op?: string) {
	if (op !== "add") return;
	if (q.data === undefined || q.data === null)
		fail('Missing required field "data"', "data", "query");
	if (!isDataObject(q.data)) fail('"data" must be an object', "data", "query");
}

function validateBulkAdd(q: Record<string, any>, op?: string) {
	if (op !== "bulkAdd") return;
	if (!Array.isArray(q.datas))
		fail('"datas" must be an array', "datas", "query");
	if (q.datas.some((item: unknown) => item === undefined || item === null))
		fail('"datas" must not contain nullish items', "datas", "query");
	if (!q.datas.every(isDataObject))
		fail('"datas" must be an array of objects', "datas", "query");
}

export function collectOperators(value: unknown) {
	const operators = new Set<string>();
	const walk = (current: unknown) => {
		if (!isObject(current)) return;
		for (const [key, child] of Object.entries(current)) {
			if (key.charCodeAt(0) !== 36) continue;
			const op = key.toLowerCase();
			operators.add(op);
			if (op === "$and" || op === "$or") {
				if (Array.isArray(child)) child.forEach(walk);
			} else if (op === "$not") {
				walk(child);
			}
		}
	};
	walk(value);
	return operators;
}
