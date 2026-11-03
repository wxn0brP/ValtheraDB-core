import { ActionsBase } from "../base/actions.js";
import { VQueryT } from "../types/query.js";
export declare function addId(query: VQueryT.Add, actions: ActionsBase, defaultGen?: boolean): Promise<void>;
export declare function addIdBulk(query: VQueryT.BulkAdd, actions: ActionsBase, defaultGen?: boolean): Promise<void>;
