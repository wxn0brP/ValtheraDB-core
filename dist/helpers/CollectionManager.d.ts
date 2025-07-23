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
    add<T = Data>(data: Arg<T>, id_gen?: boolean): Promise<T>;
    /**
     * Find data in a database.
     */
    find<T = Data>(search: Search<T>, context?: VContext, options?: DbFindOpts<T>, findOpts?: FindOpts<T>): Promise<T[]>;
    /**
     * Find one data entry in a database.
     */
    findOne<T = Data>(search: Search<T>, context?: VContext, findOpts?: FindOpts<T>): Promise<T>;
    /**
     * Update data in a database.
     */
    update<T = Data>(search: Search<T>, updater: Updater<T>, context?: VContext): Promise<boolean>;
    /**
     * Update one data entry in a database.
     */
    updateOne<T = Data>(search: Search<T>, updater: Updater<T>, context?: VContext): Promise<boolean>;
    /**
     * Remove data from a database.
     */
    remove<T = Data>(search: Search<T>, context?: VContext): Promise<boolean>;
    /**
     * Remove one data entry from a database.
     */
    removeOne<T = Data>(search: Search<T>, context?: VContext): Promise<boolean>;
    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    updateOneOrAdd<T = Data>(search: Search<T>, updater: Updater<T>, add_arg?: Arg<T>, context?: VContext, id_gen?: boolean): Promise<boolean>;
}
export default CollectionManager;
