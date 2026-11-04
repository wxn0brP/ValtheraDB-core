import { AdapterBase } from "../base/adapter";
import { VQueryT } from "../types/query";
export declare function addId(query: VQueryT.Add, adapter: AdapterBase, defaultGen?: boolean): Promise<void>;
export declare function addIdBulk(query: VQueryT.BulkAdd, adapter: AdapterBase, defaultGen?: boolean): Promise<void>;
