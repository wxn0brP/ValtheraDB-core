import CollectionManager from "../helpers/CollectionManager.js";
import { Arg, Search, Updater } from "./arg.js";
import Data from "./data.js";
import { DbFindOpts, FindOpts } from "./options.js";
import { VQuery } from "./query.js";
import { VContext } from "./types.js";
export interface ValtheraCompatible {
    c(collection: string): CollectionManager;
    getCollections(): Promise<string[]>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    add<T = Data>(collection: string, data: Arg<T>, id_gen?: boolean): Promise<T>;
    find<T = Data>(collection: string, search: Search<T>, context?: VContext, options?: DbFindOpts<T>, findOpts?: FindOpts<T>): Promise<T[]>;
    findOne<T = Data>(collection: string, search: Search<T>, context?: VContext, findOpts?: FindOpts<T>): Promise<T | null>;
    update<T = Data>(collection: string, search: Search<T>, updater: Updater<T>, context?: VContext): Promise<boolean>;
    updateOne<T = Data>(collection: string, search: Search<T>, updater: Updater<T>, context?: VContext): Promise<boolean>;
    remove<T = Data>(collection: string, search: Search<T>, context?: VContext): Promise<boolean>;
    removeOne<T = Data>(collection: string, search: Search<T>, context?: VContext): Promise<boolean>;
    removeCollection(collection: string): Promise<boolean>;
    updateOneOrAdd<T = Data>(collection: string, search: Search<T>, updater: Updater<T>, add_arg?: Arg<T>, context?: VContext, id_gen?: boolean): Promise<boolean>;
}
export interface ValtheraCompatibleInternal {
    c(config: VQuery): CollectionManager;
    getCollections(): Promise<string[]>;
    ensureCollection(config: VQuery): Promise<boolean>;
    issetCollection(config: VQuery): Promise<boolean>;
    add<T = Data>(config: VQuery): Promise<T>;
    find<T = Data>(config: VQuery): Promise<T[]>;
    findOne<T = Data>(config: VQuery): Promise<T | null>;
    update(config: VQuery): Promise<boolean>;
    updateOne(config: VQuery): Promise<boolean>;
    remove(config: VQuery): Promise<boolean>;
    removeOne(config: VQuery): Promise<boolean>;
    removeCollection(config: VQuery): Promise<boolean>;
    updateOneOrAdd(config: VQuery): Promise<boolean>;
}
