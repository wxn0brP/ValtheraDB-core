import { QueryValidationError } from "../errors.js";
import { SEARCH_OPERATOR_NAMES } from "./hasFieldsAdvanced.js";
import { isUnsafeKey } from "./security.js";
import { UPDATE_OPERATOR_NAMES } from "./updateOperators.js";
const SEARCH_OPS = new Set([
    "$and",
    "$or",
    "$not",
    "$subset",
    ...SEARCH_OPERATOR_NAMES,
]);
const UPDATE_OPS = new Set(UPDATE_OPERATOR_NAMES);
function isObject(value) {
    return typeof value === "object" && value !== null;
}
function isOperatorValue(value) {
    return isObject(value) && !Array.isArray(value);
}
function isDataObject(value) {
    return isObject(value) && !Array.isArray(value);
}
function fail(message, key, op) {
    throw new QueryValidationError(message, {
        op,
        key,
    });
}
const REQUIRED_FIELDS = {
    createIndex: [
        "index",
    ],
    removeIndex: [
        "index",
    ],
};
export function validateSearch(search) {
    if (search === undefined || search === null)
        return;
    if (typeof search === "function")
        return;
    if (!isOperatorValue(search))
        fail("Search must be an object", "search", "search");
    checkSearch(search);
}
function checkSearch(search) {
    let hasAnd = false;
    let hasOr = false;
    for (const [key, value] of Object.entries(search)) {
        if (isUnsafeKey(key))
            continue;
        if (key.charCodeAt(0) !== 36)
            continue;
        const op = key.toLowerCase();
        if (!SEARCH_OPS.has(op))
            continue;
        if (op === "$and" || op === "$or") {
            if (!Array.isArray(value))
                fail(`${key} must be an array`, key, "search");
            if (op === "$and")
                hasAnd = true;
            else
                hasOr = true;
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
export function validateUpdater(updater) {
    if (updater === undefined || updater === null)
        return;
    if (typeof updater === "function")
        return;
    if (!isOperatorValue(updater))
        fail("Updater must be an object", "updater", "update");
    for (const [key, value] of Object.entries(updater)) {
        if (isUnsafeKey(key))
            continue;
        if (key.charCodeAt(0) !== 36)
            continue;
        const op = key.toLowerCase();
        if (!UPDATE_OPS.has(op) || op === "$deepmerge")
            continue;
        if (!isOperatorValue(value))
            fail(`${key} requires an object value`, key, "update");
        checkFields(op, value, "update");
    }
}
function checkFields(op, fields, kind) {
    for (const [key, value] of Object.entries(fields)) {
        if (isUnsafeKey(key))
            continue;
        if (isOperatorValue(value) && !(value instanceof RegExp)) {
            checkFields(op, value, kind);
            continue;
        }
        const reason = kind === "search"
            ? searchValueError(op, value)
            : updateValueError(op, value);
        if (reason)
            fail(`${op} ${reason}`, key, kind);
    }
}
function searchValueError(op, value) {
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
            return value instanceof RegExp || typeof value === "string"
                ? null
                : "requires a RegExp or string";
        default:
            return null;
    }
}
function updateValueError(op, value) {
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
export function validateQuery(query, op) {
    if (!query || typeof query === "string")
        return;
    const q = query;
    if (op !== "getCollections" && !q.collection)
        fail('Missing "collection"', "collection", "query");
    for (const field of (op && REQUIRED_FIELDS[op]) || []) {
        if (q[field] === undefined || q[field] === null)
            fail(`Missing required field "${field}"`, field, "query");
    }
    validateAdd(q, op);
    validateBulkAdd(q, op);
    if (q.search !== undefined && q.search !== null)
        validateSearch(q.search);
    if (q.updater !== undefined && q.updater !== null)
        validateUpdater(q.updater);
}
function validateAdd(q, op) {
    if (op !== "add")
        return;
    if (q.data === undefined || q.data === null)
        fail('Missing required field "data"', "data", "query");
    if (!isDataObject(q.data))
        fail('"data" must be an object', "data", "query");
}
function validateBulkAdd(q, op) {
    if (op !== "bulkAdd")
        return;
    if (!Array.isArray(q.datas))
        fail('"datas" must be an array', "datas", "query");
    if (q.datas.some((item) => item === undefined || item === null))
        fail('"datas" must not contain nullish items', "datas", "query");
    if (!q.datas.every(isDataObject))
        fail('"datas" must be an array of objects', "datas", "query");
}
export function collectOperators(value) {
    const operators = new Set();
    const walk = (current) => {
        if (!isObject(current))
            return;
        for (const [key, child] of Object.entries(current)) {
            if (key.charCodeAt(0) !== 36)
                continue;
            const op = key.toLowerCase();
            operators.add(op);
            if (op === "$and" || op === "$or") {
                if (Array.isArray(child))
                    child.forEach(walk);
            }
            else if (op === "$not") {
                walk(child);
            }
        }
    };
    walk(value);
    return operators;
}
