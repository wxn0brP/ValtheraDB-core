import { VEE } from "@wxn0brp/event-emitter";
import ActionsBase from "../base/actions.js";
import CollectionManager from "../helpers/CollectionManager.js";
import executorC from "../helpers/executor.js";
import { Search, Updater } from "../types/arg.js";
import Data from "../types/data.js";
import { DbFindOpts, DbOpts, FindOpts } from "../types/options.js";
import { VQuery } from "../types/query.js";
import { VContext } from "../types/types.js";
import { UpdateOneOrAdd, ValtheraCompatible } from "../types/valthera.js";
type DbActionsFns = keyof {
    [K in keyof ActionsBase as ActionsBase[K] extends (...args: any[]) => any ? K : never]: any;
};
/**
 * Represents a database management class for performing CRUD operations.
 * @class
 */
declare class ValtheraClass implements ValtheraCompatible {
    dbAction: ActionsBase;
    executor: executorC;
    emiter: VEE;
    version: string;
    constructor(options?: DbOpts);
    init(...args: any[]): Promise<unknown>;
    execute<T>(name: DbActionsFns, query: VQuery): Promise<T>;
    /**
     * Create a new instance of a CollectionManager class.
     */
    c<T = Data>(collection: string): CollectionManager<T>;
    /**
     * Get the names of all available databases.
     */
    getCollections(): Promise<string[]>;
    /**
     * Check and create the specified collection if it doesn't exist.
     */
    ensureCollection(collection: string): Promise<boolean>;
    /**
     * Check if a collection exists.
     */
    issetCollection(collection: string): Promise<boolean>;
    /**
     * Add data to a database.
     */
    add<T extends object>(collection: string, data: T, id_gen?: true): Promise<T & {
        _id: string;
    }>;
    add<T extends object>(collection: string, data: T, id_gen: false): Promise<T>;
    /**
     * Find data in a database.
     */
    find<T = Data>(collection: string, search?: Search<T>, dbFindOpts?: DbFindOpts<T>, findOpts?: FindOpts<T>, context?: VContext): Promise<T[]>;
    /**
     * Find one data entry in a database.
     */
    findOne<T = Data>(collection: string, search?: Search<T>, findOpts?: FindOpts<T>, context?: VContext): Promise<T>;
    /**
     * Update data in a database.
     */
    update<T = Data>(collection: string, search: Search<T>, updater: Updater<T>, context?: {}): Promise<boolean>;
    /**
     * Update one data entry in a database.
     */
    updateOne<T = Data>(collection: string, search: Search<T>, updater: Updater<T>, context?: VContext): Promise<boolean>;
    /**
     * Remove data from a database.
     */
    remove<T = Data>(collection: string, search: Search<T>, context?: VContext): Promise<boolean>;
    /**
     * Remove one data entry from a database.
     */
    removeOne<T = Data>(collection: string, search: Search<T>, context?: VContext): Promise<boolean>;
    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    updateOneOrAdd<T = Data>(collection: string, search: Search<T>, updater: Updater<T>, { add_arg, context, id_gen }?: UpdateOneOrAdd<T>): Promise<boolean>;
    /**
     * Removes a database collection from the file system.
     */
    removeCollection(collection: string): Promise<boolean>;
}
export default ValtheraClass;
