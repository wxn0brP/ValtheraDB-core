import { ActionsBaseInterface } from "../types/action.js";
import { DataInternal } from "../types/data.js";
import * as Query from "../types/query.js";
export declare abstract class ActionsBase implements ActionsBaseInterface {
    _inited: boolean;
    numberId: boolean;
    init(...args: any[]): Promise<void>;
    abstract getCollections(): Promise<string[]>;
    abstract ensureCollection(collection: string): Promise<boolean>;
    abstract issetCollection(collection: string): Promise<boolean>;
    abstract removeCollection(collection: string): Promise<boolean>;
    abstract add(config: Query.AddQuery): Promise<DataInternal>;
    abstract find(config: Query.FindQuery): Promise<DataInternal[]>;
    abstract findOne(config: Query.FindOneQuery): Promise<DataInternal | null>;
    abstract update(config: Query.UpdateQuery): Promise<DataInternal[]>;
    abstract updateOne(config: Query.UpdateQuery): Promise<DataInternal | null>;
    abstract remove(config: Query.RemoveQuery): Promise<DataInternal[]>;
    abstract removeOne(config: Query.RemoveQuery): Promise<DataInternal | null>;
    updateOneOrAdd(config: Query.UpdateOneOrAddQuery): Promise<Query.UpdateOneOrAddResult<DataInternal>>;
    toggleOne(config: Query.ToggleOneQuery): Promise<Query.ToggleOneResult<DataInternal>>;
}
