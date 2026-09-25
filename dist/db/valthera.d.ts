import { VEE } from "@wxn0brp/event-emitter";
import { ActionsBase } from "../base/actions.js";
import { Collection } from "../helpers/collection.js";
import { ExecutorInterface } from "../helpers/executor.js";
import { Data } from "../types/data.js";
import { IndexOpts } from "../types/idx.js";
import { DbOpts } from "../types/options.js";
import { ValtheraPlugin } from "../types/plugin.js";
import { VQuery, VQueryT } from "../types/query.js";
import { TransactionHandle } from "../types/transaction.js";
import { ValtheraCompatible } from "../types/valthera.js";
import { Transaction } from "./transaction.js";
/**
 * Represents a database management class for performing CRUD operations.
 * @class
 */
export declare class ValtheraClass implements ValtheraCompatible {
    options: DbOpts;
    adapter: ActionsBase;
    executor: ExecutorInterface;
    emitter: VEE<{
        [K in keyof Omit<ValtheraCompatible, "c">]: (query: VQuery, result: Awaited<ReturnType<ValtheraCompatible[K]>>) => void;
    } & {
        "*": (name: keyof Omit<ValtheraCompatible, "c">, query: VQuery, result: any) => void;
    }>;
    version: string;
    _plugins: ValtheraPlugin[];
    _collections: Map<string, Collection<any>>;
    plugin(p: ValtheraPlugin): () => void;
    constructor(options: DbOpts);
    init(...args: any[]): Promise<any>;
    close(...args: any[]): Promise<any>;
    execute<T>(name: keyof ValtheraCompatible, query: VQuery<any> | string, txHandle?: TransactionHandle): Promise<T>;
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
     */
    toggleOne<T = Data>(query: VQueryT.ToggleOne<T>): Promise<VQueryT.ToggleOneResult<T>>;
    /**
     * Removes a database collection from the database.
     */
    removeCollection(collection: string): Promise<boolean>;
    /**
     * Create an index on a collection.
     */
    createIndex(collection: string, fields: string[], opts?: IndexOpts): Promise<void>;
    /**
     * @experimental
     *
     * Executes operations within a transaction. Automatically rolls back on error.
     *
     * Receives a transaction-scoped object (`tx`) whose operations are executed
     * within the transaction context.
     *
     * This feature is highly experimental and may change or be removed at any time.
     *
     * - Transaction support depends on the adapter implementation.
     * - Collections must be declared upfront to ensure proper locking.
     * - Operations invoked via the original `db` reference are NOT part of the transaction.
     */
    transaction<T>(collections: string[], fn: (tx: Transaction) => Promise<T>): Promise<T>;
}
