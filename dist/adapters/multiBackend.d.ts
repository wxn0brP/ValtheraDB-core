import { AdapterBase } from "../base/adapter";
import { VQueryT } from "../types/query";
import { TransactionHandle } from "../types/transaction";
export declare class MultiBackend extends AdapterBase {
    backends: AdapterBase[];
    primaryBackend: AdapterBase;
    constructor(backends: AdapterBase[], primaryIndex?: number);
    init(...args: any[]): Promise<void>;
    close(...args: any[]): Promise<void>;
    add(config: VQueryT.Add): Promise<import("../types/data").DataInternal>;
    find(config: VQueryT.Find): Promise<import("../types/data").DataInternal[]>;
    findOne(config: VQueryT.FindOne): Promise<import("../types/data").DataInternal | null>;
    update(config: VQueryT.Update): Promise<import("../types/data").DataInternal[]>;
    updateOne(config: VQueryT.Update): Promise<import("../types/data").DataInternal | null>;
    remove(config: VQueryT.Remove): Promise<import("../types/data").DataInternal[]>;
    removeOne(config: VQueryT.Remove): Promise<import("../types/data").DataInternal | null>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    removeCollection(collection: string): Promise<boolean>;
    getCollections(): Promise<string[]>;
    beginTransaction(): Promise<TransactionHandle>;
    commitTransaction(): Promise<void>;
    rollbackTransaction(): Promise<void>;
}
