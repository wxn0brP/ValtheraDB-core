export function resolveCollection(target) {
    return typeof target === "string" ? target : target.collection;
}
export class Collection {
    db;
    collection;
    constructor(db, collection) {
        this.db = db;
        this.collection = collection;
    }
    add(data, id_gen) {
        return this.db.add({
            collection: this.collection,
            data,
            id_gen,
        });
    }
    bulkAdd(data, id_gen) {
        return this.db.bulkAdd({
            collection: this.collection,
            datas: data,
            id_gen,
        });
    }
    /**
     * Find data in a database.
     */
    find(search = {}, options = {}, findOpts = {}) {
        return this.db.find({
            collection: this.collection,
            search,
            dbFindOpts: options,
            findOpts,
        });
    }
    /**
     * Find one data entry in a database.
     */
    findOne(search = {}, findOpts = {}) {
        return this.db.findOne({
            collection: this.collection,
            search,
            findOpts,
        });
    }
    /**
     * Count data entries in a database.
     */
    count(search = {}) {
        return this.db.count({
            collection: this.collection,
            search: search,
        });
    }
    /**
     * Update data in a database.
     */
    update(search, updater) {
        return this.db.update({
            collection: this.collection,
            search,
            updater,
        });
    }
    /**
     * Update one data entry in a database.
     */
    updateOne(search, updater) {
        return this.db.updateOne({
            collection: this.collection,
            search,
            updater,
        });
    }
    /**
     * Remove data from a database.
     */
    remove(search) {
        return this.db.remove({
            collection: this.collection,
            search,
        });
    }
    /**
     * Remove one data entry from a database.
     */
    removeOne(search) {
        return this.db.removeOne({
            collection: this.collection,
            search,
        });
    }
    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    updateOneOrAdd(search, updater, { add_arg = {}, id_gen = true } = {}) {
        return this.db.updateOneOrAdd({
            collection: this.collection,
            search,
            updater,
            add_arg,
            id_gen,
        });
    }
    /**
     * Asynchronously removes one entry in a database or adds a new one if it doesn't exist. Usage e.g. for toggling a flag.
     */
    toggleOne(search, data = {}) {
        return this.db.toggleOne({
            collection: this.collection,
            search,
            data,
        });
    }
    /**
     * Create an index on this collection.
     */
    createIndex(fields, opts) {
        return this.db.createIndex(this.collection, fields, opts);
    }
    /**
     * Remove an index from this collection. Adapter-dependent.
     */
    removeIndex(fields) {
        return this.db.removeIndex(this.collection, fields);
    }
}
