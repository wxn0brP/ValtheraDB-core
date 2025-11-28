import hasFields from "./hasFields.js";
import { compareIds } from "./id.js";
/**
 * Checks if an object meets the criteria specified in the fields with operators.
 */
export default function hasFieldsAdvanced(obj, fields) {
    if (typeof fields !== "object" || fields === null) {
        throw new Error("Fields must be an object");
    }
    if (Object.keys(fields).length === 0)
        return true;
    if ("$and" in fields) {
        return fields["$and"].every((subFields) => hasFieldsAdvanced(obj, subFields));
    }
    if ("$or" in fields) {
        return fields["$or"].some((subFields) => hasFieldsAdvanced(obj, subFields));
    }
    // Check various conditions
    if (!checkConditions(obj, fields))
        return false;
    const fieldsSubset = { ...fields };
    Object.keys(fieldsSubset).filter(key => key.startsWith("$")).forEach(key => delete fieldsSubset[key]);
    if (!Object.keys(fieldsSubset).length)
        return true;
    return hasFields(obj, fieldsSubset);
}
function checkConditions(obj, fields) {
    return (mainCheck(obj, fields) &&
        checkNot(obj, fields) &&
        checkSubset(obj, fields));
}
function mainCheck(obj, fields) {
    return _for(fields, obj, {
        gt: (data, value) => data > value,
        lt: (data, value) => data < value,
        gte: (data, value) => data >= value,
        lte: (data, value) => data <= value,
        in: (data, value) => value.includes(data),
        nin: (data, value) => !value.includes(data),
        type: (data, value) => typeof data === value,
        exists: (_, shouldExist, key) => {
            if (shouldExist && !(key in obj))
                return false;
            if (!shouldExist && (key in obj))
                return false;
            return true;
        },
        regex: (data, regexData) => {
            const regex = typeof regexData === "string" ? new RegExp(regexData) : regexData;
            return regex.test(data);
        },
        size: (data, size) => {
            if (Array.isArray(data) || typeof data === "string") {
                return data.length === size;
            }
            else {
                return false;
            }
        },
        startsWith: (data, value) => typeof data === "string" && data.startsWith(value),
        endsWith: (data, value) => typeof data === "string" && data.endsWith(value),
        between: (data, [min, max]) => typeof data === "number" && data >= min && data <= max,
        arrinc: (data, values) => Array.isArray(data) && values.some((val) => data.includes(val)),
        arrincall: (data, values) => Array.isArray(data) && values.every((val) => data.includes(val)),
        idGt: (data, value) => compareIds(data, value) > 0,
        idLt: (data, value) => compareIds(data, value) < 0,
        idGte: (data, value) => compareIds(data, value) >= 0,
        idLte: (data, value) => compareIds(data, value) <= 0,
    });
}
function checkNot(obj, fields) {
    if ("$not" in fields) {
        return !hasFieldsAdvanced(obj, fields["$not"]);
    }
    return true;
}
function checkSubset(obj, fields) {
    if ("$subset" in fields) {
        const setFields = fields["$subset"];
        return hasFields(obj, setFields);
    }
    return true;
}
function _for(fields, obj, opts) {
    for (const [fieldRaw, fieldFn] of Object.entries(opts)) {
        const field = "$" + fieldRaw;
        if (field in fields) {
            for (const [key, value] of Object.entries(fields[field])) {
                if (!fieldFn(obj?.[key], value, key))
                    return false;
            }
        }
    }
    return true;
}
