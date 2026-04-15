import { VEE } from "@wxn0brp/event-emitter";
import { ActionsBase } from "../base/actions.js";
import { Collection } from "../helpers/collection.js";
import { Executor } from "../helpers/executor.js";
import { Data } from "../types/data.js";
import { DbOpts } from "../types/options.js";
import { VQueryT, VQuery } from "../types/query.js";
import { ValtheraCompatible } from "../types/valthera.js";
/**
 * Represents a database management class for performing CRUD operations.
 * @class
 */
export declare class ValtheraClass implements ValtheraCompatible {
    dbAction: ActionsBase;
    executor: Executor;
    emiter: VEE<{
        [K in keyof ValtheraCompatible]: (query: VQuery, result: Awaited<ReturnType<ValtheraCompatible[K]>>) => void;
    } & {
        "*": (name: keyof ValtheraCompatible, query: VQuery, result: any) => void;
    }>;
    version: string;
    constructor(options: DbOpts);
    init(...args: any[]): Promise<unknown>;
    execute<T>(name: keyof ValtheraCompatible, query: VQuery<any> | string): Promise<T>;
    /**
     * Create a new instance of a Collection class.
     */
    c<T = Data>(collection: string): Collection<T>;
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
    add<T = Data>(query: VQueryT.Add<T>): Promise<T>;
    /**
     * Find data in a database.
     */
    find<T = Data>(query: VQueryT.Find<T>): Promise<T[]>;
    /**
     * Find one data entry in a database.
     */
    findOne<T = Data>(query: VQueryT.FindOne<T>): Promise<T>;
    /**
     * Update data in a database.
     */
    update<T = Data>(query: VQueryT.Update<T>): Promise<T[]>;
    /**
     * Update one data entry in a database.
     */
    updateOne<T = Data>(query: VQueryT.Update<T>): Promise<T>;
    /**
     * Remove data from a database.
     */
    remove<T = Data>(query: VQueryT.Remove<T>): Promise<T[]>;
    /**
     * Remove one data entry from a database.
     */
    removeOne<T = Data>(query: VQueryT.Remove<T>): Promise<T>;
    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    updateOneOrAdd<T = Data>(query: VQueryT.UpdateOneOrAdd<T>): Promise<VQueryT.UpdateOneOrAddResult<T>>;
    /**
     * Asynchronously removes one entry in a database or adds a new one if it doesn't exist. Usage e.g. for toggling a flag.
     * Returns a promise resolving to `false` if the entry was found and removed,
     * or `true` if the entry was added. The returned value reflects the state of the database
     * after the operation.
     */
    toggleOne<T = Data>(query: VQueryT.ToggleOne<T>): Promise<VQueryT.ToggleOneResult<T>>;
    /**
     * Removes a database collection from the file system.
     */
    removeCollection(collection: string): Promise<boolean>;
}
