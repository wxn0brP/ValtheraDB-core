import { Arg } from "../types/arg";
import hasFields from "./hasFields";

/**
 * Checks if an object meets the criteria specified in the fields with operators.
 */
export default function hasFieldsAdvanced(obj: Object, fields: Arg) {
    if (typeof fields !== "object" || fields === null) {
        throw new Error("Fields must be an object");
    }

    if (Object.keys(fields).length === 0) return true;

    if ("$and" in fields) {
        return fields["$and"].every(subFields => hasFieldsAdvanced(obj, subFields));
    }

    if ("$or" in fields) {
        return fields["$or"].some(subFields => hasFieldsAdvanced(obj, subFields));
    }

    // Check various conditions
    if (!checkConditions(obj, fields)) return false;

    const fieldsSubset = { ...fields };
    Object.keys(fieldsSubset).filter(key => key.startsWith("$")).forEach(key => delete fieldsSubset[key]);
    if (!Object.keys(fieldsSubset).length) return true;

    return hasFields(obj, fieldsSubset);
}

function checkConditions(obj: Object, fields: Object) {
    return (
        mainCheck(obj, fields) &&
        checkNot(obj, fields) &&
        checkSubset(obj, fields)
    );
}

function mainCheck(obj: Object, fields: Object) {
    return _for(fields, {
        gt: (key, value) => obj[key] > value,
        lt: (key, value) => obj[key] < value,
        gte: (key, value) => obj[key] >= value,
        lte: (key, value) => obj[key] <= value,
        in: (key, value) => value.includes(obj[key]),
        nin: (key, value) => !value.includes(obj[key]),
        type: (key, value) => typeof obj[key] === value,

        exists: (key, shouldExist) => {
            if (shouldExist && !(key in obj)) return false;
            if (!shouldExist && (key in obj)) return false;
            return true;
        },
        regex: (key, regexData) => {
            const regex = typeof regexData === "string" ? new RegExp(regexData) : regexData;
            if (!regex.test(obj[key])) return false;
        },
        size: (key, size) => {
            if (Array.isArray(obj[key]) || typeof obj[key] === "string") {
                if (obj[key].length !== size) return false;
            } else {
                return false;
            }
        },

        startsWith: (key, value) => typeof obj[key] === "string" && obj[key].startsWith(value),
        endsWith: (key, value) => typeof obj[key] === "string" && obj[key].endsWith(value),
        between: (key, [min, max]) => typeof obj[key] === "number" && obj[key] >= min && obj[key] <= max,
        arrinc: (key, values) => Array.isArray(obj[key]) && values.some(val => obj[key].includes(val)),
        arrincall: (key, values) => Array.isArray(obj[key]) && values.every(val => obj[key].includes(val)),
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

function _for(fields: Object, opts: Record<string, (key: string, value: any) => boolean>) {
    for (const [fieldRaw, fieldFn] of Object.entries(opts)) {
        const field = "$" + fieldRaw;

        if (field in fields) {
            for (const [key, value] of Object.entries(fields[field])) {
                if (!fieldFn(key, value)) return false;
            }
        }

    }
    return true;
}