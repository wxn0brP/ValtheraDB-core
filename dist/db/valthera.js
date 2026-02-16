import { VEE } from "@wxn0brp/event-emitter";
import { Collection } from "../helpers/collection.js";
import { Executor } from "../helpers/executor.js";
import { version } from "../version.js";
/**
 * Represents a database management class for performing CRUD operations.
 * @class
 */
export class ValtheraClass {
    dbAction;
    executor;
    emiter = new VEE();
    version = version;
    constructor(options) {
        this.dbAction = options.dbAction;
        this.executor = options.executor || new Executor();
        if (options.numberId)
            this.dbAction.numberId = true;
    }
    async init(...args) {
        if (this.dbAction._inited)
            return;
        const self = this;
        return await this.executor.addOp(async () => {
            if (self.dbAction._inited)
                return;
            await self.dbAction.init(...args);
            self.dbAction._inited = true;
        });
    }
    async execute(name, query) {
        await this.init();
        const result = await this.executor.addOp(this.dbAction[name].bind(this.dbAction), query);
        this.emiter.emit(name, query, result);
        return result;
    }
    /**
     * Create a new instance of a CollectionManager class.
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
        return await this.execute("ensureCollection", { collection });
    }
    /**
     * Check if a collection exists.
     */
    async issetCollection(collection) {
        return await this.execute("issetCollection", { collection });
    }
    /**
     * Add data to a database.
     */
    add(query) {
        query.control ||= {};
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
        query.id_gen ||= true;
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
        return this.execute("removeCollection", { collection });
    }
}
