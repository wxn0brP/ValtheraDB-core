import CollectionManager from "../helpers/CollectionManager.js";
import { Arg, Search, Updater } from "./arg.js";
import Data from "./data.js";
import { DbFindOpts, FindOpts } from "./options.js";
import { VQuery } from "./query.js";
import { VContext } from "./types.js";
export interface ValtheraCompatible {
    c(collection: string): CollectionManager;
    getCollections(): Promise<string[]>;
    checkCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    add<T = Data>(collection: string, data: Arg, id_gen?: boolean): Promise<T>;
    find<T = Data>(collection: string, search: Search, context?: VContext, options?: DbFindOpts, findOpts?: FindOpts): Promise<T[]>;
    findOne<T = Data>(collection: string, search: Search, context?: VContext, findOpts?: FindOpts): Promise<T | null>;
    update(collection: string, search: Search, updater: Updater, context?: VContext): Promise<boolean>;
    updateOne(collection: string, search: Search, updater: Updater, context?: VContext): Promise<boolean>;
    remove(collection: string, search: Search, context?: VContext): Promise<boolean>;
    removeOne(collection: string, search: Search, context?: VContext): Promise<boolean>;
    removeCollection(collection: string): Promise<boolean>;
    updateOneOrAdd(collection: string, search: Search, updater: Updater, add_arg?: Arg, context?: VContext, id_gen?: boolean): Promise<boolean>;
}
export interface ValtheraCompatibleInternal {
    c(config: VQuery): CollectionManager;
    getCollections(): Promise<string[]>;
    checkCollection(config: VQuery): Promise<boolean>;
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
