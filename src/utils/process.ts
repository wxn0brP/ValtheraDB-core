import { Data, DataInternal } from "../types/data";
import { VQuery, VQueryT } from "../types/query";
import { hasFieldsAdvanced } from "./hasFieldsAdvanced";
import { updateFindObject } from "./projection";
import { updateObjectAdvanced } from "./updateOperators";

export function findObj(
	config: VQueryT.Find | VQueryT.FindOne,
	obj: Data,
): DataInternal | null {
	if (!matchObj(config, obj)) return null;
	return updateFindObject(obj, config.findOpts ?? {}) as DataInternal;
}

export function matchObj(config: VQuery, obj: Data) {
	return hasFieldsAdvanced(obj, config.search!);
}

/**
 * @returns reference to object or new object
 */
export function updateObj(config: VQueryT.Update, obj: Data): DataInternal {
	updateObjectAdvanced(obj, config.updater);
	return obj;
}
