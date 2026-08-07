import { Data, DataInternal } from "../types/data.js";
import { VQuery, VQueryT } from "../types/query.js";
export declare function findObj(config: VQueryT.Find | VQueryT.FindOne, obj: Data): DataInternal | null;
export declare function matchObj(config: VQuery, obj: Data): boolean;
export declare function updateObj(config: VQueryT.Update, obj: Data): DataInternal;
