import { CustomAdapterBase } from "../base/customAdapter.js";
import { VQueryT } from "../types/query.js";
export declare class MemoryAdapter extends CustomAdapterBase {
    memory: Map<string, any[]>;
    smartExecutor: boolean;
    capabilities: {
        transactions: boolean;
        indexes: boolean;
        persistent: boolean;
    };
    constructor();
    _readMemory(key: string): any[];
    _writeMemory(key: string, data: any[]): void;
    getCollections(): Promise<string[]>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    removeCollection(collection: string): Promise<boolean>;
    count(config: VQueryT.Count): Promise<number>;
}
export { 
/** @deprecated Use MemoryAdapter. */
MemoryAdapter as MemoryAction, };
