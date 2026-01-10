import { Arg, Search, Updater } from "../types/arg.js";
import { DbFindOpts, FindOpts } from "../types/options.js";
import { VContext } from "../types/types.js";
import Data from "../types/data.js";
import { UpdateOneOrAdd, ValtheraCompatible } from "../types/valthera.js";
export declare class CollectionManager<D = Data> {
    private db;
    private collection;
    constructor(db: ValtheraCompatible, collection: string);
    /**
     * Add data to a database.
     */
    add(data: Arg<D>, id_gen?: boolean): Promise<D>;
    /**
     * Find data in a database.
     */
    find(search?: Search<D>, options?: DbFindOpts<D>, findOpts?: FindOpts<D>, context?: VContext): Promise<D[]>;
    /**
     * Find one data entry in a database.
     */
    findOne(search?: Search<D>, findOpts?: FindOpts<D>, context?: VContext): Promise<D>;
    /**
     * Update data in a database.
     */
    update(search: Search<D>, updater: Updater<D>, context?: VContext): Promise<boolean>;
    /**
     * Update one data entry in a database.
     */
    updateOne(search: Search<D>, updater: Updater<D>, context?: VContext): Promise<boolean>;
    /**
     * Remove data from a database.
     */
    remove(search: Search<D>, context?: VContext): Promise<boolean>;
    /**
     * Remove one data entry from a database.
     */
    removeOne(search: Search<D>, context?: VContext): Promise<boolean>;
    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    updateOneOrAdd(search: Search<D>, updater: Updater<D>, { add_arg, context, id_gen }?: UpdateOneOrAdd<D>): Promise<boolean>;
    /**
     * Asynchronously removes one entry in a database or adds a new one if it doesn't exist. Usage e.g. for toggling a flag.
     */
    toggleOne(search: Search<D>, data?: Arg<D>, context?: VContext): Promise<boolean>;
}
