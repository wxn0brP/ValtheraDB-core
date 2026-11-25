import { Data, DataInternal } from "../types/data";
import { VQuery, VQueryT } from "../types/query";
export declare function findObj(config: VQueryT.Find | VQueryT.FindOne, obj: Data): DataInternal | null;
export declare function matchObj(config: VQuery, obj: Data): any;
export declare function updateObj(config: VQueryT.Update, obj: Data): DataInternal;
