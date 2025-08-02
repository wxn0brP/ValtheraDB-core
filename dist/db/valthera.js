import { EventEmitter } from "@wxn0brp/event-emitter";
import ActionsBase from "../base/actions.js";
import CollectionManager from "../helpers/CollectionManager.js";
import executorC from "../helpers/executor.js";
import { version } from "../version.js";
/**
 * Represents a database management class for performing CRUD operations.
 * @class
 */
class ValtheraClass {
    dbAction;
    executor;
    emiter;
    version = version;
    constructor(options = {}) {
        this.dbAction = options.dbAction || new ActionsBase();
        this.executor = options.executor || new executorC();
        this.emiter = new EventEmitter();
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
        const emitArgs = Array.from(arguments).slice(1);
        this.emiter.emit(name, emitArgs, result);
        this.emiter.emit("*", name, emitArgs, result);
        return result;
    }
    /**
     * Create a new instance of a CollectionManager class.
     */
    c(collection) {
        return new CollectionManager(this, collection);
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
    async add(collection, data, id_gen = true) {
        return await this.execute("add", { collection, data, id_gen });
    }
    /**
     * Find data in a database.
     */
    async find(collection, search = {}, context = {}, dbFindOpts = {}, findOpts = {}) {
        return await this.execute("find", { collection, search, context, dbFindOpts, findOpts });
    }
    /**
     * Find one data entry in a database.
     */
    async findOne(collection, search = {}, context = {}, findOpts = {}) {
        return await this.execute("findOne", { collection, search, context, findOpts });
    }
    /**
     * Update data in a database.
     */
    async update(collection, search, updater, context = {}) {
        return await this.execute("update", { collection, search, updater, context });
    }
    /**
     * Update one data entry in a database.
     */
    async updateOne(collection, search, updater, context = {}) {
        return await this.execute("updateOne", { collection, search, updater, context });
    }
    /**
     * Remove data from a database.
     */
    async remove(collection, search, context = {}) {
        return await this.execute("remove", { collection, search, context });
    }
    /**
     * Remove one data entry from a database.
     */
    async removeOne(collection, search, context = {}) {
        return await this.execute("removeOne", { collection, search, context });
    }
    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    async updateOneOrAdd(collection, search, updater, add_arg = {}, context = {}, id_gen = true) {
        return await this.execute("updateOneOrAdd", { collection, search, updater, add_arg, context, id_gen });
    }
    /**
     * Removes a database collection from the file system.
     */
    async removeCollection(collection) {
        return await this.execute("removeCollection", { collection });
    }
}
export default ValtheraClass;
