import { hasFieldsAdvanced } from "./hasFieldsAdvanced.js";
import { updateFindObject } from "./updateFindObject.js";
import { updateObjectAdvanced } from "./updateObject.js";
export function findObj(config, obj) {
    if (matchObj(config, obj))
        return updateFindObject(obj, config.findOpts || {});
    return null;
}
export function matchObj(config, obj) {
    const { search, context } = config;
    if (search === undefined || search === null)
        return true;
    if (typeof search === "function" && search(obj, context))
        return true;
    if (typeof search === "object" &&
        !Array.isArray(search) &&
        hasFieldsAdvanced(obj, search))
        return true;
    return false;
}
/**
 * @returns reference to object or new object
 */
export function updateObj(config, obj) {
    const { updater, context } = config;
    if (typeof updater === "object" && !Array.isArray(updater)) {
        updateObjectAdvanced(obj, updater);
        return obj;
    }
    if (typeof updater === "function") {
        const updateObjValue = updater(obj, context);
        if (updateObjValue)
            return updateObjValue;
        return obj;
    }
    return obj;
}
