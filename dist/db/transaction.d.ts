import { Collection } from "../helpers/collection";
import { Data } from "../types/data";
import { VQueryT } from "../types/query";
import { TransactionHandle } from "../types/transaction";
import { ValtheraClass } from "./valthera";
export declare class Transaction {
    readonly handle: TransactionHandle;
    _parent: ValtheraClass;
    constructor(handle: TransactionHandle, _parent: ValtheraClass);
    c<T = Data>(name: string): Collection<T>;
    add<T = Data>(q: VQueryT.Add<T>): Promise<T>;
    find<T = Data>(q: VQueryT.Find<T, true>): Promise<T[]>;
    findOne<T = Data>(q: VQueryT.FindOne<T>): Promise<T>;
    update<T = Data>(q: VQueryT.Update<T>): Promise<T[]>;
    updateOne<T = Data>(q: VQueryT.Update<T>): Promise<T>;
    remove<T = Data>(q: VQueryT.Remove<T>): Promise<T[]>;
    removeOne<T = Data>(q: VQueryT.Remove<T>): Promise<T>;
    updateOneOrAdd<T = Data>(q: VQueryT.UpdateOneOrAdd<T>): Promise<VQueryT.UpdateOneOrAddResult<T>>;
    toggleOne<T = Data>(q: VQueryT.ToggleOne<T>): Promise<VQueryT.ToggleOneResult<T>>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    getCollections(): Promise<string[]>;
    removeCollection(collection: string): Promise<boolean>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
}
