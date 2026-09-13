import { DataInternal } from "./data.js";
import { Id } from "./Id.js";
import { AdapterOpts } from "./options.js";
import { VQueryT } from "./query.js";
import { TransactionHandle } from "./transaction.js";
export interface ActionsBaseInterface {
    _inited: boolean;
    adapterOpts: AdapterOpts;
    smartExecutor: boolean;
    init(...args: any[]): Promise<void>;
    close(...args: any[]): Promise<void>;
    getCollections(): Promise<string[]>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    removeCollection(collection: string): Promise<boolean>;
    add(query: VQueryT.Add): Promise<DataInternal>;
    find(query: VQueryT.Find): Promise<DataInternal[]>;
    findOne(query: VQueryT.FindOne): Promise<DataInternal | null>;
    update(query: VQueryT.Update): Promise<DataInternal[]>;
    updateOne(query: VQueryT.Update): Promise<DataInternal | null>;
    remove(query: VQueryT.Remove): Promise<DataInternal[]>;
    removeOne(query: VQueryT.Remove): Promise<DataInternal | null>;
    updateOneOrAdd(query: VQueryT.UpdateOneOrAdd): Promise<VQueryT.UpdateOneOrAddResult<DataInternal>>;
    toggleOne(query: VQueryT.ToggleOne): Promise<VQueryT.ToggleOneResult<DataInternal>>;
    beginTransaction(id: Id): Promise<TransactionHandle>;
    commitTransaction(handle: TransactionHandle): Promise<void>;
    rollbackTransaction(handle: TransactionHandle): Promise<void>;
}
