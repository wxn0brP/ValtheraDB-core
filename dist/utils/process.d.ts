import { Data } from "../types/data.js";
import { VQuery, VQueryT } from "../types/query.js";
export declare function findProcessLine(config: VQueryT.Find | VQueryT.FindOne, obj: Data): Object;
export declare function match(config: VQuery, obj: Data): boolean;
export declare function update(config: VQueryT.Update, obj: Data): Data;
