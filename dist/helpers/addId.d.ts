import { AdapterBase } from "../base/adapter.js";
import { VQueryT } from "../types/query.js";
export declare function addId(query: VQueryT.Add, adapter: AdapterBase, defaultGen?: boolean): Promise<void>;
export declare function addIdBulk(query: VQueryT.BulkAdd, adapter: AdapterBase, defaultGen?: boolean): Promise<void>;
