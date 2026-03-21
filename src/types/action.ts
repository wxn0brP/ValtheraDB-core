import { DataInternal } from "./data";
import { VQueryT } from "./query";

export interface ActionsBaseInterface {
    _inited: boolean;
    numberId: boolean;
    init(...args: any[]): Promise<void>;

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
}
