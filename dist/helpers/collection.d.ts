import { Arg, Search, Updater } from "../types/arg.js";
import { Data } from "../types/data.js";
import { DbFindOpts, FindOpts } from "../types/options.js";
import { VContext } from "../types/types.js";
import { UpdateOneOrAdd, ValtheraCompatible } from "../types/valthera.js";
export declare class Collection<D = Data> {
    db: ValtheraCompatible;
    collection: string;
    constructor(db: ValtheraCompatible, collection: string);
    /**
     * Add data to a database.
     */
    add(data: Arg<D>, id_gen: true): Promise<D>;
    add(data: Arg<D>, id_gen?: true): Promise<D & {
        _id: string;
    }>;
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
    update(search: Search<D>, updater: Updater<D>, context?: VContext): Promise<D[]>;
    /**
     * Update one data entry in a database.
     */
    updateOne(search: Search<D>, updater: Updater<D>, context?: VContext): Promise<D>;
    /**
     * Remove data from a database.
     */
    remove(search: Search<D>, context?: VContext): Promise<D[]>;
    /**
     * Remove one data entry from a database.
     */
    removeOne(search: Search<D>, context?: VContext): Promise<D>;
    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    updateOneOrAdd(search: Search<D>, updater: Updater<D>, { add_arg, context, id_gen }?: UpdateOneOrAdd<D>): Promise<D>;
    /**
     * Asynchronously removes one entry in a database or adds a new one if it doesn't exist. Usage e.g. for toggling a flag.
     */
    toggleOne(search: Search<D>, data?: Arg<D>, context?: VContext): Promise<D>;
}
