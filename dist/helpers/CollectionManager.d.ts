import { Arg, Search, Updater } from "../types/arg.js";
import { DbFindOpts, FindOpts } from "../types/options.js";
import { VContext } from "../types/types.js";
import Data from "../types/data.js";
import { ValtheraCompatible } from "../types/valthera.js";
declare class CollectionManager<D = Data> {
    private db;
    private collection;
    constructor(db: ValtheraCompatible, collection: string);
    /**
     * Add data to a database.
     */
    add<T = Data>(data: Arg<T & D>, id_gen?: boolean): Promise<T>;
    /**
     * Find data in a database.
     */
    find<T = Data>(search?: Search<T & D>, context?: VContext, options?: DbFindOpts<T & Data>, findOpts?: FindOpts<T & Data>): Promise<T[]>;
    /**
     * Find one data entry in a database.
     */
    findOne<T = Data>(search?: Search<T & Data>, context?: VContext, findOpts?: FindOpts<T & Data>): Promise<T>;
    /**
     * Update data in a database.
     */
    update<T = Data>(search: Search<T & Data>, updater: Updater<T & Data>, context?: VContext): Promise<boolean>;
    /**
     * Update one data entry in a database.
     */
    updateOne<T = Data>(search: Search<T & Data>, updater: Updater<T & Data>, context?: VContext): Promise<boolean>;
    /**
     * Remove data from a database.
     */
    remove<T = Data>(search: Search<T & Data>, context?: VContext): Promise<boolean>;
    /**
     * Remove one data entry from a database.
     */
    removeOne<T = Data>(search: Search<T & Data>, context?: VContext): Promise<boolean>;
    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    updateOneOrAdd<T = Data>(search: Search<T & Data>, updater: Updater<T & Data>, add_arg?: Arg<T & Data>, context?: VContext, id_gen?: boolean): Promise<boolean>;
}
export default CollectionManager;
