import { CollectionManager } from "../helpers/collectionManager";
import { Arg, Search, Updater } from "./arg";
import Data from "./data";
import { DbFindOpts, FindOpts } from "./options";
import { VContext } from "./types";

export interface ValtheraCompatible {
    c(collection: string): CollectionManager;
    getCollections(): Promise<string[]>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    add<T = Data>(collection: string, data: Arg<T>, id_gen?: boolean): Promise<T>;
    find<T = Data>(collection: string, search?: Search<T>, options?: DbFindOpts<T>, findOpts?: FindOpts<T>, context?: VContext): Promise<T[]>;
    findOne<T = Data>(collection: string, search?: Search<T>, findOpts?: FindOpts<T>, context?: VContext): Promise<T | null>;
    update<T = Data>(collection: string, search: Search<T>, updater: Updater<T>, context?: VContext): Promise<boolean>;
    updateOne<T = Data>(collection: string, search: Search<T>, updater: Updater<T>, context?: VContext): Promise<boolean>;
    remove<T = Data>(collection: string, search: Search<T>, context?: VContext): Promise<boolean>;
    removeOne<T = Data>(collection: string, search: Search<T>, context?: VContext): Promise<boolean>;
    removeCollection(collection: string): Promise<boolean>;
    updateOneOrAdd<T = Data>(collection: string, search: Search<T>, updater: Updater<T>, opts?: UpdateOneOrAdd<T>): Promise<boolean>;
    toggleOne<T = Data>(collection: string, search: Search<T>, data?: Arg<T>, context?: VContext): Promise<boolean>;
}

export interface UpdateOneOrAdd<T> {
    add_arg?: Arg<T>;
    id_gen?: boolean;
    context?: VContext;
}