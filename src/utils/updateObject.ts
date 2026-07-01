import { UpdaterArg } from "../types/updater";
import { _deepMerge } from "./merge";

/**
 * Updates an object with new values.
 * @param obj - The object to update.
 * @param field - An object containing new values to update in the target object.
 */
export function updateObjectAdvanced(obj: Record<string, any>, field: UpdaterArg): Record<string, any> {
    if (typeof field !== "object" || Array.isArray(field) || field === null)
        throw new Error("Fields must be an object");

    if (Object.keys(field).length === 0)
        return obj;

    const newObj = structuredClone(obj);

    const $fields = {};
    const subsetFields = {};

    Object.keys(field).forEach(key => {
        if (key.startsWith("$")) $fields[key.toLowerCase()] = field[key];
        else subsetFields[key] = field[key];
    });

    mainUpdate(newObj, $fields);
    const mergedObj = deepMerge(newObj, $fields);
    updateObject(mergedObj, subsetFields);

    return mergedObj;
}

function deepMerge(obj: Object, fields: UpdaterArg) {
    if (!("$deepmerge" in fields)) return obj;
    if (Object.keys(obj).length === 0) return fields.$deepmerge;
    _deepMerge(obj, fields.$deepmerge);
    return obj;
}

function mainUpdate(obj: Object, fields: UpdaterArg) {
    _for(fields, obj, {
        push: (item, updater) => {
            if (Array.isArray(item)) {
                item.push(updater);
                return item;
            }
            return [updater];
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
                return [...new Set(item)];
            }
            return [updater];
        },

        pull: (item, updater) => {
            if (Array.isArray(item)) return item.filter(i => i !== updater);
        },

        pullall: (item, updater) => {
            if (Array.isArray(item)) return item.filter(i => !(updater as string[]).includes(i));
        },

        merge: (item, updater) => {
            if (typeof item === "object" && typeof updater === "object") {
                Object.assign(item, updater);
                return item;
            }
            return updater;
        },

        inc: (item, updater, key, deepObj) => {
            if (typeof item === "number" && typeof updater === "number") {
                return item + updater;
            }
            if (!(key in deepObj)) return updater;
            throw new Error(`Cannot increment non-numeric value at key: ${key}`);
        },

        dec: (item, updater, key, deepObj) => {
            if (typeof item === "number" && typeof updater === "number") {
                return item - updater;
            }
            if (!(key in deepObj)) return -updater;
            throw new Error(`Cannot decrement non-numeric value at key: ${key}`);
        },

        rename: (_, newKey, oldKey, deepObj) => {
            if (oldKey in deepObj) {
                deepObj[newKey as string] = deepObj[oldKey];
                delete deepObj[oldKey];
            }
        },

        set: (_, value) => value,

        unset: (_, __, key, deepObj) => {
            if (key in deepObj)
                delete deepObj[key];
        }
    });
}

/**
 * Updates an object with new values.
 * @param obj - The object to update.
 * @param newVal - An object containing new values to update in the target object.
 */
function updateObject(obj: Object, newVal: UpdaterArg) {
    for (let key in newVal)
        if (newVal.hasOwnProperty(key))
            obj[key] = newVal[key];

    return obj;
}

function _for(
    fields: Record<string, any>,
    obj: Record<string, any>,
    opts: Record<string, (data: any, value: any, key: string, deepObj: Record<string, any>) => any>
) {
    for (const [field, value] of Object.entries(fields)) {
        const fieldRaw = field.slice(1);
        const fieldFn = opts[fieldRaw];
        if (!fieldFn) continue;

        for (const [key, val] of Object.entries(value as Record<string, any>)) {
            if (typeof val === "object" && val !== null && !Array.isArray(val)) {
                if (!obj[key]) obj[key] = {};
                deepUpdateCheck(val, obj[key], fieldFn);
            } else {
                const res = fieldFn(obj?.[key], val, key, obj);
                if (res !== undefined) obj[key] = res;
            }
        }
    }
}

function deepUpdateCheck(
    valueObj: Record<string, any>,
    targetObj: any,
    fieldFn: (data: any, value: any, key: string, deepObj: Record<string, any>) => any
) {
    for (const [k, v] of Object.entries(valueObj)) {
        if (typeof v === "object" && v !== null && !Array.isArray(v)) {
            if (!targetObj[k]) targetObj[k] = {};
            deepUpdateCheck(v, targetObj[k], fieldFn);
        } else {
            const res = fieldFn(targetObj[k], v, k, targetObj);
            if (res !== undefined) targetObj[k] = res;
        }
    }
}
