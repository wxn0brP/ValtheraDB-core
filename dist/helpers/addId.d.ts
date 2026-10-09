import { ActionsBase } from "../base/actions";
import { VQuery, VQueryT } from "../types/query";
export declare function addId(query: VQuery, actions: ActionsBase, defaultGen?: boolean): Promise<import("../types/arg").Arg<import("../types/data").Data> | undefined>;
export declare function addIdBulk(query: VQueryT.BulkAdd, actions: ActionsBase, defaultGen?: boolean): Promise<void>;
