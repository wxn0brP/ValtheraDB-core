import { Arg, Search, Updater } from "../types/arg.js";
import { DbFindOpts, FindOpts } from "../types/options.js";
import { VContext } from "../types/types.js";
import Data from "../types/data.js";
import { ValtheraCompatible } from "../types/valthera.js";
declare class CollectionManager {
    private db;
    private collection;
    constructor(db: ValtheraCompatible, collection: string);
    /**
     * Add data to a database.
     */
    add<T = Data>(data: Arg, id_gen?: boolean): Promise<T>;
    /**
     * Find data in a database.
     */
    find<T = Data>(search: Search, context?: VContext, options?: DbFindOpts, findOpts?: FindOpts): Promise<T[]>;
    /**
     * Find one data entry in a database.
     */
    findOne<T = Data>(search: Search, context?: VContext, findOpts?: FindOpts): Promise<T>;
    /**
     * Update data in a database.
     */
    update(search: Search, updater: Updater, context?: VContext): Promise<boolean>;
    /**
     * Update one data entry in a database.
     */
    updateOne(search: Search, updater: Updater, context?: VContext): Promise<boolean>;
    /**
     * Remove data from a database.
     */
    remove(search: Search, context?: VContext): Promise<boolean>;
    /**
     * Remove one data entry from a database.
     */
    removeOne(search: Search, context?: VContext): Promise<boolean>;
    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    updateOneOrAdd(search: Search, updater: Updater, add_arg?: Arg, context?: VContext, id_gen?: boolean): Promise<boolean>;
}
export default CollectionManager;
