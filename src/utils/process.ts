import { Data } from "../types/data";
import { VQuery, VQueryT } from "../types/query";
import { hasFieldsAdvanced } from "./hasFieldsAdvanced";
import { updateFindObject } from "./updateFindObject";
import { updateObjectAdvanced } from "./updateObject";

export function findProcessLine(config: VQueryT.Find | VQueryT.FindOne, obj: Data) {
    if (match(config, obj)) return updateFindObject(obj, config.findOpts || {});
    return null;
}

export function match(config: VQuery, obj: Data) {
    const { search, context } = config;

    if (search === undefined || search === null) return true;
    if (typeof search === "function" && search(obj, context)) return true;
    if (typeof search === "object" && !Array.isArray(search) && hasFieldsAdvanced(obj, search)) return true;

    return false;
}

export function update(config: VQueryT.Update, obj: Data) {
    const { updater, context } = config;

    if (typeof updater === "object" && !Array.isArray(updater))
        return updateObjectAdvanced(obj, updater);

    if (typeof updater === "function") {
        const updateObjValue = updater(obj, context);

        if (updateObjValue) return updateObjValue;
        return obj;
    }

    return obj;
}
