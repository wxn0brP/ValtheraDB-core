import { Collection } from "../helpers/collection.js";
import { Data } from "./data.js";
import { AddQuery, FindOneQuery, FindQuery, RemoveQuery, ToggleOneQuery, ToggleOneResult, UpdateOneOrAddQuery, UpdateOneOrAddResult, UpdateQuery } from "./query.js";
export interface ValtheraCompatible {
    c<T = Data>(collection: string): Collection<T>;
    getCollections(): Promise<string[]>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    add<T = Data>(query: AddQuery): Promise<T>;
    find<T = Data>(query: FindQuery): Promise<T[]>;
    findOne<T = Data>(query: FindOneQuery): Promise<T | null>;
    update<T = Data>(query: UpdateQuery): Promise<T[] | null>;
    updateOne<T = Data>(query: UpdateQuery): Promise<T | null>;
    remove<T = Data>(query: RemoveQuery): Promise<T[] | null>;
    removeOne<T = Data>(query: RemoveQuery): Promise<T | null>;
    removeCollection(collection: string): Promise<boolean>;
    updateOneOrAdd<T = Data>(query: UpdateOneOrAddQuery): Promise<UpdateOneOrAddResult<T>>;
    toggleOne<T = Data>(query: ToggleOneQuery): Promise<ToggleOneResult<T>>;
}
