import { Collection } from "../helpers/collection.js";
import { Data } from "./data.js";
import * as Query from "./query.js";
export interface ValtheraCompatible {
    c<T = Data>(collection: string): Collection<T>;
    getCollections(): Promise<string[]>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    add<T = Data>(query: Query.AddQuery<T>): Promise<T>;
    find<T = Data>(query: Query.FindQuery<T>): Promise<T[]>;
    findOne<T = Data>(query: Query.FindOneQuery<T>): Promise<T | null>;
    update<T = Data>(query: Query.UpdateQuery<T>): Promise<T[]>;
    updateOne<T = Data>(query: Query.UpdateQuery<T>): Promise<T | null>;
    remove<T = Data>(query: Query.RemoveQuery<T>): Promise<T[]>;
    removeOne<T = Data>(query: Query.RemoveQuery<T>): Promise<T | null>;
    removeCollection(collection: string): Promise<boolean>;
    updateOneOrAdd<T = Data>(query: Query.UpdateOneOrAddQuery<T>): Promise<Query.UpdateOneOrAddResult<T>>;
    toggleOne<T = Data>(query: Query.ToggleOneQuery<T>): Promise<Query.ToggleOneResult<T>>;
}
