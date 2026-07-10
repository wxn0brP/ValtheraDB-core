import { VEE } from "@wxn0brp/event-emitter";
import { Collection } from "../helpers/collection.js";
import { SmartExecutor } from "../helpers/executor.js";
import { version } from "../version.js";
/**
 * Represents a database management class for performing CRUD operations.
 * @class
 */
export class ValtheraClass {
    options;
    adapter;
    executor;
    emitter = new VEE();
    /** @deprecated typo */
    emiter = this.emitter;
    version = version;
    _plugins = [];
    plugin(p) {
        p.init?.(this);
        this._plugins.push(p);
        return () => {
            const i = this._plugins.indexOf(p);
            if (i !== -1)
                this._plugins.splice(i, 1);
        };
    }
    /** @deprecated use `adapter` */
    get dbAction() {
        return this.adapter;
    }
    /** @deprecated use `adapter` */
    set dbAction(action) {
        this.adapter = action;
    }
    constructor(options) {
        this.options = options;
        this.executor = options.executor || new SmartExecutor(undefined, false);
        options.adapter ??= options.dbAction;
        options.dbAction ??= options.adapter;
        if (typeof options.adapter === "function")
            return;
        else
            this.adapter = options.adapter;
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
            if (!self.options.executor && self.adapter.smartExecutor && self.executor instanceof SmartExecutor)
                self.executor.aware = true;
            if (self.options.numberId)
                self.adapter.numberId = true;
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
    async execute(name, query) {
        await this.init();
        const plugins = this._plugins;
        const self = this;
        let idx = 0;
        const ctx = {
            op: name,
            query,
            next: async () => {
                if (idx < plugins.length)
                    return plugins[idx++].execute(ctx);
                return self.executor.addOp(self.adapter[ctx.op].bind(self.adapter), ctx.query, typeof ctx.query === "string" ? ctx.query : ctx.query.collection);
            }
        };
        const result = await ctx.next();
        this.emitter.emit(ctx.op, ctx.query, result);
        return result;
    }
    /**
     * Create a new instance of a Collection class.
     */
    c(collection) {
        return new Collection(this, collection);
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
        query.control ||= {};
        query.id_gen ??= true;
        return this.execute("add", query);
    }
    /**
     * Find data in a database.
     */
    find(query) {
        query.search ||= {};
        query.dbFindOpts ||= {};
        query.findOpts ||= {};
        query.context ||= {};
        query.control ||= {};
        return this.execute("find", query);
    }
    /**
     * Find one data entry in a database.
     */
    findOne(query) {
        query.findOpts ||= {};
        query.context ||= {};
        query.control ||= {};
        return this.execute("findOne", query);
    }
    /**
     * Update data in a database.
     */
    update(query) {
        query.context ||= {};
        query.control ||= {};
        return this.execute("update", query);
    }
    /**
     * Update one data entry in a database.
     */
    updateOne(query) {
        query.context ||= {};
        query.control ||= {};
        return this.execute("updateOne", query);
    }
    /**
     * Remove data from a database.
     */
    remove(query) {
        query.context ||= {};
        query.control ||= {};
        return this.execute("remove", query);
    }
    /**
     * Remove one data entry from a database.
     */
    removeOne(query) {
        query.context ||= {};
        query.control ||= {};
        return this.execute("removeOne", query);
    }
    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    updateOneOrAdd(query) {
        query.context ||= {};
        query.add_arg ||= {};
        query.control ||= {};
        query.id_gen ??= true;
        return this.execute("updateOneOrAdd", query);
    }
    /**
     * Asynchronously removes one entry in a database or adds a new one if it doesn't exist. Usage e.g. for toggling a flag.
     * Returns a promise resolving to `false` if the entry was found and removed,
     * or `true` if the entry was added. The returned value reflects the state of the database
     * after the operation.
     */
    toggleOne(query) {
        query.data ||= {};
        query.context ||= {};
        query.control ||= {};
        return this.execute("toggleOne", query);
    }
    /**
     * Removes a database collection from the file system.
     */
    removeCollection(collection) {
        return this.execute("removeCollection", collection);
    }
}
