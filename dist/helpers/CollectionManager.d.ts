import { Arg, Search, Updater } from "../types/arg.js";
import { DbFindOpts, FindOpts } from "../types/options.js";
import { VContext } from "../types/types.js";
import Data from "../types/data.js";
import { UpdateOneOrAdd, ValtheraCompatible } from "../types/valthera.js";
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
    find<T = Data>(search?: Search<T & D>, options?: DbFindOpts<T & D>, findOpts?: FindOpts<T & D>, context?: VContext): Promise<T[]>;
    /**
     * Find one data entry in a database.
     */
    findOne<T = Data>(search?: Search<T & D>, findOpts?: FindOpts<T & D>, context?: VContext): Promise<T>;
    /**
     * Update data in a database.
     */
    update<T = Data>(search: Search<T & D>, updater: Updater<T & D>, context?: VContext): Promise<boolean>;
    /**
     * Update one data entry in a database.
     */
    updateOne<T = Data>(search: Search<T & D>, updater: Updater<T & D>, context?: VContext): Promise<boolean>;
    /**
     * Remove data from a database.
     */
    remove<T = Data>(search: Search<T & D>, context?: VContext): Promise<boolean>;
    /**
     * Remove one data entry from a database.
     */
    removeOne<T = Data>(search: Search<T & D>, context?: VContext): Promise<boolean>;
    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    updateOneOrAdd<T = Data>(search: Search<T & D>, updater: Updater<T & D>, { add_arg, context, id_gen }?: UpdateOneOrAdd<T & D>): Promise<boolean>;
    /**
     * Asynchronously removes one entry in a database or adds a new one if it doesn't exist. Usage e.g. for toggling a flag.
     */
    toggleOne<T = Data>(search: Search<T & D>, data?: Arg<T & D>, context?: VContext): Promise<boolean>;
}
export default CollectionManager;
