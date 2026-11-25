import { hasFieldsAdvanced } from "./hasFieldsAdvanced.js";
import { updateFindObject } from "./projection.js";
import { updateObjectAdvanced } from "./updateOperators.js";
export function findObj(config, obj) {
    if (!matchObj(config, obj))
        return null;
    return updateFindObject(obj, config.findOpts ?? {});
}
export function matchObj(config, obj) {
    return hasFieldsAdvanced(obj, config.search);
}
/**
 * @returns reference to object or new object
 */
export function updateObj(config, obj) {
    updateObjectAdvanced(obj, config.updater);
    return obj;
}
