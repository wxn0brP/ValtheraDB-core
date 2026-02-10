import { Arg } from "../types/arg";
import { hasFields } from "./hasFields";
import { compareIds } from "./id";

/**
 * Checks if an object meets the criteria specified in the fields with operators.
 */
export function hasFieldsAdvanced(obj: Object, fields: Arg) {
    if (typeof fields !== "object" || fields === null) {
        throw new Error("Fields must be an object");
    }

    if (Object.keys(fields).length === 0) return true;

    if ("$and" in fields) {
        return fields["$and"].every((subFields: Object) => hasFieldsAdvanced(obj, subFields));
    }

    if ("$or" in fields) {
        return fields["$or"].some((subFields: Object) => hasFieldsAdvanced(obj, subFields));
    }

    const $fields = {};
    const subsetFields = {};

    Object.keys(fields).forEach(key => {
        if (key.startsWith("$")) $fields[key.toLowerCase()] = fields[key];
        else subsetFields[key] = fields[key];
    });

    if (!checkConditions(obj, $fields)) return false;

    if (!Object.keys(subsetFields).length) return true;
    return hasFields(obj, subsetFields);
}

function checkConditions(obj: Object, fields: Object) {
    return (
        mainCheck(obj, fields) &&
        checkNot(obj, fields) &&
        checkSubset(obj, fields)
    );
}

function mainCheck(obj: Object, fields: Object) {
    return _for(fields, obj, {
        gt: (data, value) => data > value,
        lt: (data, value) => data < value,
        gte: (data, value) => data >= value,
        lte: (data, value) => data <= value,
        in: (data, value) => value.includes(data),
        nin: (data, value) => !value.includes(data),
        type: (data, value) => typeof data === value,

        exists: (_, shouldExist, key) => {
            if (shouldExist && !(key in obj)) return false;
            if (!shouldExist && (key in obj)) return false;
            return true;
        },
        regex: (data, regexData) => {
            const regex = typeof regexData === "string" ? new RegExp(regexData) : regexData;
            return regex.test(data);
        },
        size: (data, size) => {
            if (Array.isArray(data) || typeof data === "string") {
                return data.length === size;
            } else {
                return false;
            }
        },

        startswith: (data, value) => typeof data === "string" && data.startsWith(value),
        endswith: (data, value) => typeof data === "string" && data.endsWith(value),
        between: (data, [min, max]) => typeof data === "number" && data >= min && data <= max,
        arrinc: (data, values) => Array.isArray(data) && values.some((val: any) => data.includes(val)),
        arrincall: (data, values) => Array.isArray(data) && values.every((val: any) => data.includes(val)),

        idgt: (data, value) => compareIds(data, value) > 0,
        idlt: (data, value) => compareIds(data, value) < 0,
        idgte: (data, value) => compareIds(data, value) >= 0,
        idlte: (data, value) => compareIds(data, value) <= 0,
    });
}

function checkNot(obj: Object, fields: Object) {
    if ("$not" in fields) {
        return !hasFieldsAdvanced(obj, fields["$not"]);
    }
    return true;
}

function checkSubset(obj: Object, fields: Object) {
    if ("$subset" in fields) {
        const setFields = fields["$subset"];
        return hasFields(obj, setFields);
    }
    return true;
}

function _for(fields: Record<string, any>, obj: Record<string, any>, opts: Record<string, (data: any, value: any, key: string) => boolean>): boolean {
    for (const [fieldRaw, fieldFn] of Object.entries(opts)) {
        const field = "$" + fieldRaw;

        if (field in fields) {
            for (const [key, value] of Object.entries(fields[field])) {
                const targetValue = obj?.[key];

                if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                    if (!deepCheck(value, targetValue, fieldFn)) return false;
                } else {
                    if (!fieldFn(targetValue, value, key)) return false;
                }
            }
        }
    }
    return true;
}

function deepCheck(valueObj: Record<string, any>, targetObj: any, fieldFn: (data: any, value: any, key: string) => boolean): boolean {
    if (typeof targetObj !== "object" || targetObj === null) return false;

    for (const [k, v] of Object.entries(valueObj)) {
        const targetValue = targetObj[k];
        if (typeof v === "object" && v !== null && !Array.isArray(v)) {
            if (!deepCheck(v, targetValue, fieldFn)) return false;
        } else {
            if (!fieldFn(targetValue, v, k)) return false;
        }
    }
    return true;
}