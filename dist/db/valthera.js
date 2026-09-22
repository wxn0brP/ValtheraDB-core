import { VEE } from "@wxn0brp/event-emitter";
import { Collection } from "../helpers/collection.js";
import { SmartExecutor } from "../helpers/executor.js";
import { genId } from "../helpers/gen.js";
import { applyAddDefaults, applyFindDefaults, applyFindOneDefaults, applyRemoveDefaults, applyToggleOneDefaults, applyUpdateDefaults, applyUpdateOneOrAddDefaults, } from "../helpers/queryDefaults.js";
import { version } from "../version.js";
import { Transaction } from "./transaction.js";
/**
 * Represents a database management class for performing CRUD operations.
 * @class
 */
export class ValtheraClass {
    options;
    adapter;
    executor;
    emitter = new VEE();
    version = version;
    _plugins = [];
    _collections = new Map();
    plugin(p) {
        p.init?.(this);
        this._plugins.push(p);
        return () => {
            const i = this._plugins.indexOf(p);
            if (i !== -1)
                this._plugins.splice(i, 1);
        };
    }
    constructor(options) {
        this.options = options;
        this.executor = options.executor || new SmartExecutor(undefined, false);
        if (typeof options.adapter === "function")
            return;
        else {
            this.adapter = options.adapter;
            if (options.adapterOpts) {
                this.adapter.adapterOpts = options.adapterOpts;
            }
        }
        options.executorAware ??= true;
    }
    async init(...args) {
        if (this.adapter?._inited)
            return;
        const self = this;
        return await this.executor.addOp(async () => {
            if (self.adapter?._inited)
                return;
            if (typeof self.options.adapter === "function")
                self.adapter = await self.options.adapter();
            // if the executor is not set, and the action wants a smart executor
            if (!self.options.executor &&
                self.options.executorAware &&
                self.adapter.smartExecutor &&
                self.executor instanceof SmartExecutor)
                self.executor.aware = true;
            if (self.options.adapterOpts) {
                self.adapter.adapterOpts = {
                    ...self.adapter.adapterOpts,
                    ...self.options.adapterOpts,
                };
            }
            await self.adapter.init(...args);
            self.adapter._inited = true;
        });
    }
    async close(...args) {
        if (!this.adapter._inited)
            return;
        const self = this;
        return await this.executor.addOp(async () => {
            if (!self.adapter._inited)
                return;
            await self.adapter.close(...args);
            self.adapter._inited = false;
        });
    }
    async execute(name, query, txHandle) {
        await this.init();
        if (txHandle && typeof query === "object")
            query.transaction = txHandle;
        const plugins = this._plugins;
        const self = this;
        let idx = 0;
        const ctx = {
            op: name,
            query,
            next: async () => {
                if (idx < plugins.length)
                    return plugins[idx++].execute(ctx);
                if (txHandle)
                    return self.adapter[ctx.op](query, txHandle);
                return self.executor.addOp(self.adapter[ctx.op].bind(self.adapter), ctx.query, typeof ctx.query === "string" ? ctx.query : ctx.query.collection);
            },
        };
        const result = await ctx.next();
        this.emitter.emit(ctx.op, ctx.query, result);
        return result;
    }
    /**
     * Create a new instance of a Collection class.
     */
    c(collection) {
        if (this._collections.has(collection))
            return this._collections.get(collection);
        const col = new Collection(this, collection);
        this._collections.set(collection, col);
        return col;
    }
    /**
     * Get the names of all available databases.
     */
    async getCollections() {
        return await this.execute("getCollections", {});
    }
    /**
     * Check and create the specified collection if it doesn't exist.
     */
    async ensureCollection(collection) {
        return await this.execute("ensureCollection", collection);
    }
    /**
     * Check if a collection exists.
     */
    async issetCollection(collection) {
        return await this.execute("issetCollection", collection);
    }
    /**
     * Add data to a database.
     */
    add(query) {
        applyAddDefaults(query);
        return this.execute("add", query);
    }
    /**
     * Find data in a database.
     */
    find(query) {
        applyFindDefaults(query);
        return this.execute("find", query);
    }
    /**
     * Find one data entry in a database.
     */
    findOne(query) {
        applyFindOneDefaults(query);
        return this.execute("findOne", query);
    }
    /**
     * Update data in a database.
     */
    update(query) {
        applyUpdateDefaults(query);
        return this.execute("update", query);
    }
    /**
     * Update one data entry in a database.
     */
    updateOne(query) {
        applyUpdateDefaults(query);
        return this.execute("updateOne", query);
    }
    /**
     * Remove data from a database.
     */
    remove(query) {
        applyRemoveDefaults(query);
        return this.execute("remove", query);
    }
    /**
     * Remove one data entry from a database.
     */
    removeOne(query) {
        applyRemoveDefaults(query);
        return this.execute("removeOne", query);
    }
    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    updateOneOrAdd(query) {
        applyUpdateOneOrAddDefaults(query);
        return this.execute("updateOneOrAdd", query);
    }
    /**
     * Asynchronously removes one entry in a database or adds a new one if it doesn't exist. Usage e.g. for toggling a flag.
     */
    toggleOne(query) {
        applyToggleOneDefaults(query);
        return this.execute("toggleOne", query);
    }
    /**
     * Removes a database collection from the database.
     */
    removeCollection(collection) {
        this._collections.delete(collection);
        return this.execute("removeCollection", collection);
    }
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
    async transaction(collections, fn) {
        await this.init();
        const releases = [];
        const promises = collections.map(collection => {
            let started;
            const startedPromise = new Promise(r => (started = r));
            this.executor.addOp(async () => {
                started();
                await new Promise(resolve => releases.push(resolve));
            }, undefined, collection);
            return startedPromise;
        });
        await Promise.all(promises);
        const handle = await this.adapter.beginTransaction(genId());
        const tx = new Transaction(handle, this);
        try {
            const result = await fn(tx);
            await tx.commit();
            return result;
        }
        catch (err) {
            try {
                await tx.rollback();
            }
            catch (rollbackErr) {
                throw new AggregateError([
                    err,
                    rollbackErr,
                ], "Transaction failed and rollback failed");
            }
            throw err;
        }
        finally {
            releases.forEach(release => release());
        }
    }
}
