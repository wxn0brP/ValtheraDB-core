import { Arg, Search, Updater } from "../types/arg.js";
import { UpdateOneOrAdd } from "../types/collection.js";
import { Data } from "../types/data.js";
import { DbFindOpts, FindOpts } from "../types/options.js";
import { ToggleOneResult, UpdateOneOrAddResult } from "../types/query.js";
import { VContext } from "../types/types.js";
import { ValtheraCompatible } from "../types/valthera.js";
export declare class Collection<D = Data> {
    db: ValtheraCompatible;
    collection: string;
    constructor(db: ValtheraCompatible, collection: string);
    /**
     * Add data to a database.
     */
    add(data: Arg<D>, id_gen: false): Promise<D>;
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
    updateOne(search: Search<D>, updater: Updater<D>, context?: VContext): Promise<D | null>;
    /**
     * Remove data from a database.
     */
    remove(search: Search<D>, context?: VContext): Promise<D[]>;
    /**
     * Remove one data entry from a database.
     */
    removeOne(search: Search<D>, context?: VContext): Promise<D | null>;
    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    updateOneOrAdd(search: Search<D>, updater: Updater<D>, { add_arg, context, id_gen }?: UpdateOneOrAdd<D>): Promise<UpdateOneOrAddResult<D>>;
    /**
     * Asynchronously removes one entry in a database or adds a new one if it doesn't exist. Usage e.g. for toggling a flag.
     * Returns a promise resolving to `false` if the entry was found and removed,
     * or `true` if the entry was added. The returned value reflects the state of the database
     * after the operation.
     */
    toggleOne(search: Search<D>, data?: Arg<D>, context?: VContext): Promise<ToggleOneResult<D>>;
}
