import { UniversalEventEmitter } from "../helpers/eventEmiter.js";
import dbActionBase from "../base/actions.js";
import CollectionManager from "../helpers/CollectionManager.js";
import executorC from "../helpers/executor.js";
import { Arg, Search, Updater } from "../types/arg.js";
import Data from "../types/data.js";
import { DbOpts, DbFindOpts, FindOpts } from "../types/options.js";
import { VContext } from "../types/types.js";
import { ValtheraCompatible } from "../types/valthera.js";
/**
 * Represents a database management class for performing CRUD operations.
 * @class
 */
declare class ValtheraClass implements ValtheraCompatible {
    dbAction: dbActionBase;
    executor: executorC;
    emiter: UniversalEventEmitter;
    version: string;
    constructor(options?: DbOpts);
    private execute;
    /**
     * Create a new instance of a CollectionManager class.
     */
    c(collection: string): CollectionManager;
    /**
     * Get the names of all available databases.
     */
    getCollections(): Promise<string[]>;
    /**
     * Check and create the specified collection if it doesn't exist.
     */
    checkCollection(collection: string): Promise<boolean>;
    /**
     * Check if a collection exists.
     */
    issetCollection(collection: string): Promise<boolean>;
    /**
     * Add data to a database.
     */
    add<T = Data>(collection: string, data: Arg<T>, id_gen?: boolean): Promise<T>;
    /**
     * Find data in a database.
     */
    find<T = Data>(collection: string, search: Search<T>, context?: VContext, dbFindOpts?: DbFindOpts<T>, findOpts?: FindOpts<T>): Promise<T[]>;
    /**
     * Find one data entry in a database.
     */
    findOne<T = Data>(collection: string, search: Search<T>, context?: VContext, findOpts?: FindOpts<T>): Promise<T>;
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
    updateOneOrAdd<T = Data>(collection: string, search: Search<T>, updater: Updater<T>, add_arg?: Arg, context?: VContext, id_gen?: boolean): Promise<boolean>;
    /**
     * Removes a database collection from the file system.
     */
    removeCollection(collection: string): Promise<boolean>;
}
export default ValtheraClass;
