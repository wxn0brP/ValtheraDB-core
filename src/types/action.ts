import { DataInternal } from "./data";
import * as Query from "./query";

export interface ActionsBaseInterface {
    _inited: boolean;
    numberId: boolean;
    init(...args: any[]): Promise<void>;

    getCollections(): Promise<string[]>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    removeCollection(collection: string): Promise<boolean>;

    add(query: Query.AddQuery): Promise<DataInternal>;
    find(query: Query.FindQuery): Promise<DataInternal[]>;
    findOne(query: Query.FindOneQuery): Promise<DataInternal | null>;
    update(query: Query.UpdateQuery): Promise<DataInternal[]>;
    updateOne(query: Query.UpdateQuery): Promise<DataInternal | null>;
    remove(query: Query.RemoveQuery): Promise<DataInternal[]>;
    removeOne(query: Query.RemoveQuery): Promise<DataInternal | null>;
    updateOneOrAdd(query: Query.UpdateOneOrAddQuery): Promise<Query.UpdateOneOrAddResult<DataInternal>>;
    toggleOne(query: Query.ToggleOneQuery): Promise<Query.ToggleOneResult<DataInternal>>;
}
