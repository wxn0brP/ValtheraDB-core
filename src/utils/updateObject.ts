import { UpdaterArg } from "../types/updater";
import { deepMerge } from "./merge";

/**
 * Updates an object with new values.
 * @param obj - The object to update.
 * @param field - An object containing new values to update in the target object.
 */
export default function updateObjectAdvanced(obj: Object, field: UpdaterArg) {
    if (typeof field !== "object" || field === null) {
        throw new Error("Fields must be an object or object array");
    }

    if (typeof field !== "object" || field === null) {
        throw new Error("Fields must be an object or object array");
    }

    updateAdvanced(obj, field);
    const fieldsSubset = { ...field };
    Object.keys(fieldsSubset).filter(key => key.startsWith("$")).forEach(key => delete fieldsSubset[key]);
    updateObject(obj, fieldsSubset);

    return obj;
}

function updateAdvanced(obj: Object, fields: UpdaterArg) {
    mainUpdate(obj, fields);
    updateUnset(obj, fields);
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
        pushSet: (item, updater) => {
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
                return { ...item, ...updater };
            }
            return updater;
        },

        deepMerge: (item, updater) => {
            if (typeof item === "object" && typeof updater === "object") {
                return deepMerge(item, updater);
            }
            return updater;
        },

        inc: (item, updater, key) => {
            if (typeof item === "number" && typeof updater === "number") {
                return item + updater;
            }
            if (!(key in obj)) return updater;
            throw new Error(`Cannot increment non-numeric value at key: ${key}`);
        },

        dec: (item, updater, key) => {
            if (typeof item === "number" && typeof updater === "number") {
                return item - updater;
            }
            if (!(key in obj)) return -updater;
            throw new Error(`Cannot decrement non-numeric value at key: ${key}`);
        },

        rename: (_, newKey, oldKey) => {
            if (oldKey in obj) {
                obj[newKey as string] = obj[oldKey];
                delete obj[oldKey];
            }
        },

        set: (_, value) => value
    });
}

function updateUnset(obj: Object, fields: UpdaterArg) {
    if ("$unset" in fields) {
        for (const key of Object.keys(fields["$unset"])) {
            delete obj[key];
        }
    }
}

/**
 * Updates an object with new values.
 * @param obj - The object to update.
 * @param newVal - An object containing new values to update in the target object.
 */
function updateObject(obj: Object, newVal: UpdaterArg) {
    for (let key in newVal) {
        if (newVal.hasOwnProperty(key)) {
            obj[key] = newVal[key];
        }
    }
    return obj;
}

function _for(fields: UpdaterArg, obj: Object, opts: Record<string, (item: any, updater: any, key: string) => any>) {
    for (const [fieldRaw, fieldFn] of Object.entries(opts)) {
        const field = "$" + fieldRaw;

        if (field in fields) {
            for (const [key, value] of Object.entries(fields[field])) {
                const res = fieldFn(obj?.[key], value, key);
                if (res !== undefined) obj[key] = res;
            }
        }
    }
}