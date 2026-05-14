import { hasFieldsAdvanced } from "./hasFieldsAdvanced.js";
import { updateFindObject } from "./updateFindObject.js";
import { updateObjectAdvanced } from "./updateObject.js";
export function findProcessLine(config, obj) {
    if (match(config, obj))
        return updateFindObject(obj, config.findOpts || {});
    return null;
}
export function match(config, obj) {
    const { search, context } = config;
    if (search === undefined || search === null)
        return true;
    if (typeof search === "function" && search(obj, context))
        return true;
    if (typeof search === "object" && !Array.isArray(search) && hasFieldsAdvanced(obj, search))
        return true;
    return false;
}
export function update(config, obj) {
    const { updater, context } = config;
    if (typeof updater === "object" && !Array.isArray(updater))
        return updateObjectAdvanced(obj, updater);
    if (typeof updater === "function") {
        const updateObjValue = updater(obj, context);
        if (updateObjValue)
            return updateObjValue;
        return obj;
    }
    return obj;
}
