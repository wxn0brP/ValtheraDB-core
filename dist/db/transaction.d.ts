import { Collection } from "../helpers/collection.js";
import { Data } from "../types/data.js";
import { VQueryT } from "../types/query.js";
import { TransactionHandle } from "../types/transaction.js";
import { ValtheraClass } from "./valthera.js";
/**
 * Transaction context. Operations are executed directly through the parent
 * database with the transaction handle passed to the executor.
 */
export declare class Transaction {
    readonly handle: TransactionHandle;
    _parent: ValtheraClass;
    constructor(handle: TransactionHandle, _parent: ValtheraClass);
    c<T = Data>(name: string): Collection<T>;
    add<T = Data>(q: VQueryT.Add<T>): Promise<T>;
    bulkAdd<T = Data>(q: VQueryT.BulkAdd<T>): Promise<import("../types/data.js").DataInternal[]>;
    find<T = Data>(q: VQueryT.Find<T, true>): Promise<T[]>;
    findOne<T = Data>(q: VQueryT.FindOne<T>): Promise<T | null>;
    update<T = Data>(q: VQueryT.Update<T>): Promise<T[]>;
    updateOne<T = Data>(q: VQueryT.Update<T>): Promise<T | null>;
    remove<T = Data>(q: VQueryT.Remove<T>): Promise<T[]>;
    removeOne<T = Data>(q: VQueryT.Remove<T>): Promise<T | null>;
    updateOneOrAdd<T = Data>(q: VQueryT.UpdateOneOrAdd<T>): Promise<VQueryT.UpdateOneOrAddResult<T>>;
    toggleOne<T = Data>(q: VQueryT.ToggleOne<T>): Promise<VQueryT.ToggleOneResult<T>>;
    count<T = Data>(q: VQueryT.Count<T>): Promise<number>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    getCollections(): Promise<string[]>;
    removeCollection(collection: string): Promise<boolean>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
}
