import { Collection } from "../helpers/collection";
import { Data } from "./data";
import { VQueryT } from "./query";

export interface ValtheraCompatible {
    c<T = Data>(collection: string): Collection<T>;
    getCollections(): Promise<string[]>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    add<T = Data>(query: VQueryT.Add<T>): Promise<T>;
    find<T = Data>(query: VQueryT.Find<T>): Promise<T[]>;
    findOne<T = Data>(query: VQueryT.FindOne<T>): Promise<T | null>;
    update<T = Data>(query: VQueryT.Update<T>): Promise<T[]>;
    updateOne<T = Data>(query: VQueryT.Update<T>): Promise<T | null>;
    remove<T = Data>(query: VQueryT.Remove<T>): Promise<T[]>;
    removeOne<T = Data>(query: VQueryT.Remove<T>): Promise<T | null>;
    removeCollection(collection: string): Promise<boolean>;
    updateOneOrAdd<T = Data>(query: VQueryT.UpdateOneOrAdd<T>): Promise<VQueryT.UpdateOneOrAddResult<T>>;
    toggleOne<T = Data>(query: VQueryT.ToggleOne<T>): Promise<VQueryT.ToggleOneResult<T>>;
}
