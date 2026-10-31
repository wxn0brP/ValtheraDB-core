import { ActionsBase } from "../base/actions.js";
import { VQuery, VQueryT } from "../types/query.js";
export declare function addId(query: VQuery, actions: ActionsBase, defaultGen?: boolean): Promise<import("../types/arg.js").Arg<import("../types/data.js").Data> | undefined>;
export declare function addIdBulk(query: VQueryT.BulkAdd, actions: ActionsBase, defaultGen?: boolean): Promise<void>;
