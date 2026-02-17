import { Collection } from "../helpers/collection";
import { Data } from "./data";
import { AddQuery, FindOneQuery, FindQuery, RemoveQuery, ToggleOneQuery, ToggleOneResult, UpdateOneOrAddQuery, UpdateOneOrAddResult, UpdateQuery } from "./query";
export interface ValtheraCompatible {
    c<T = Data>(collection: string): Collection<T>;
    getCollections(): Promise<string[]>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    add<T = Data>(query: AddQuery<T>): Promise<T>;
    find<T = Data>(query: FindQuery<T>): Promise<T[]>;
    findOne<T = Data>(query: FindOneQuery<T>): Promise<T | null>;
    update<T = Data>(query: UpdateQuery<T>): Promise<T[]>;
    updateOne<T = Data>(query: UpdateQuery<T>): Promise<T | null>;
    remove<T = Data>(query: RemoveQuery<T>): Promise<T[]>;
    removeOne<T = Data>(query: RemoveQuery<T>): Promise<T | null>;
    removeCollection(collection: string): Promise<boolean>;
    updateOneOrAdd<T = Data>(query: UpdateOneOrAddQuery<T>): Promise<UpdateOneOrAddResult<T>>;
    toggleOne<T = Data>(query: ToggleOneQuery<T>): Promise<ToggleOneResult<T>>;
}
