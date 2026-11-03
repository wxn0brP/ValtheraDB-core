import { QueryValidationError } from "../errors.js";
import { _deepMerge } from "./merge.js";
import { isUnsafeKey } from "./security.js";
/**
 * Updates an object with new values.
 * @param obj - The object to update.
 * @param field - An object containing new values to update in the target object.
 */
export function updateObjectAdvanced(obj, field) {
    if (typeof field !== "object" || Array.isArray(field) || field === null)
        throw new QueryValidationError("Fields must be an object", {
            op: "update",
        });
    if (Object.keys(field).length === 0)
        return;
    const $fields = {};
    const subsetFields = {};
    let hasDollar = false;
    let hasSubset = false;
    for (const key in field) {
        if (!Object.hasOwn(field, key) || isUnsafeKey(key))
            continue;
        if (key.charCodeAt(0) === 36) {
            $fields[key.toLowerCase()] = field[key];
            hasDollar = true;
        }
        else {
            subsetFields[key] = field[key];
            hasSubset = true;
        }
    }
    if (hasDollar) {
        mainUpdate(obj, $fields);
        deepMerge(obj, $fields);
    }
    if (hasSubset)
        updateObject(obj, subsetFields);
}
function deepMerge(obj, fields) {
    if (!Object.hasOwn(fields, "$deepmerge"))
        return obj;
    if (Object.keys(obj).length === 0)
        return fields.$deepmerge;
    _deepMerge(obj, fields.$deepmerge);
    return obj;
}
function mainUpdate(obj, fields) {
    _for(fields, obj, {
        push: (item, updater) => {
            if (Array.isArray(item)) {
                item.push(updater);
                return item;
            }
            return [
                updater,
            ];
        },
        pushall: (item, updater) => {
            if (Array.isArray(item)) {
                item.push(...updater);
                return item;
            }
            return updater;
        },
        pushset: (item, updater) => {
            if (Array.isArray(item)) {
                item.push(updater);
                return [
                    ...new Set(item),
                ];
            }
            return [
                updater,
            ];
        },
        pull: (item, updater) => {
            if (Array.isArray(item))
                return item.filter(i => i !== updater);
        },
        pullall: (item, updater) => {
            if (Array.isArray(item))
                return item.filter(i => !updater.includes(i));
        },
        merge: (item, updater) => {
            if (Array.isArray(item) && Array.isArray(updater)) {
                return [
                    ...item,
                    ...updater,
                ];
            }
            if (typeof item === "object" &&
                item !== null &&
                typeof updater === "object" &&
                updater !== null &&
                !Array.isArray(item) &&
                !Array.isArray(updater)) {
                for (const key of Object.keys(updater)) {
                    if (isUnsafeKey(key))
                        continue;
                    item[key] = updater[key];
                }
                return item;
            }
            return updater;
        },
        inc: (item, updater, key, deepObj) => {
            if (typeof item === "number" && typeof updater === "number") {
                return item + updater;
            }
            if (!Object.hasOwn(deepObj, key))
                return updater;
            throw new QueryValidationError(`Cannot increment non-numeric value at key: ${key}`, {
                op: "update",
                key,
            });
        },
        dec: (item, updater, key, deepObj) => {
            if (typeof item === "number" && typeof updater === "number") {
                return item - updater;
            }
            if (!Object.hasOwn(deepObj, key))
                return -updater;
            throw new QueryValidationError(`Cannot decrement non-numeric value at key: ${key}`, {
                op: "update",
                key,
            });
        },
        rename: (_, newKey, oldKey, deepObj) => {
            if (isUnsafeKey(oldKey) || isUnsafeKey(newKey))
                return;
            if (Object.hasOwn(deepObj, oldKey)) {
                deepObj[newKey] = deepObj[oldKey];
                delete deepObj[oldKey];
            }
        },
        set: (_, value) => value,
        unset: (_, __, key, deepObj) => {
            if (Object.hasOwn(deepObj, key))
                delete deepObj[key];
        },
    });
}
/**
 * Updates an object with new values.
 * @param obj - The object to update.
 * @param newVal - An object containing new values to update in the target object.
 */
function updateObject(obj, newVal) {
    for (const key in newVal) {
        if (!Object.hasOwn(newVal, key) || isUnsafeKey(key))
            continue;
        obj[key] = newVal[key];
    }
    return obj;
}
function _for(fields, obj, opts) {
    for (const [field, value] of Object.entries(fields)) {
        const fieldRaw = field.slice(1);
        const fieldFn = Object.hasOwn(opts, fieldRaw) ? opts[fieldRaw] : undefined;
        if (!fieldFn)
            continue;
        for (const [key, val] of Object.entries(value)) {
            if (isUnsafeKey(key))
                continue;
            if (typeof val === "object" && val !== null && !Array.isArray(val)) {
                if (!Object.hasOwn(obj, key) || !obj[key])
                    obj[key] = {};
                deepUpdateCheck(val, obj[key], fieldFn);
            }
            else {
                const res = fieldFn(obj?.[key], val, key, obj);
                if (res !== undefined)
                    obj[key] = res;
            }
        }
    }
}
function deepUpdateCheck(valueObj, targetObj, fieldFn) {
    for (const [k, v] of Object.entries(valueObj)) {
        if (isUnsafeKey(k))
            continue;
        if (typeof v === "object" && v !== null && !Array.isArray(v)) {
            if (!Object.hasOwn(targetObj, k) || !targetObj[k])
                targetObj[k] = {};
            deepUpdateCheck(v, targetObj[k], fieldFn);
        }
        else {
            const res = fieldFn(targetObj[k], v, k, targetObj);
            if (res !== undefined)
                targetObj[k] = res;
        }
    }
}
