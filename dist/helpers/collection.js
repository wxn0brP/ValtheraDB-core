export class Collection {
    db;
    collection;
    constructor(db, collection) {
        this.db = db;
        this.collection = collection;
    }
    add(data, id_gen) {
        return this.db.add({ collection: this.collection, data, id_gen });
    }
    /**
     * Find data in a database.
     */
    find(search = {}, options = {}, findOpts = {}, context = {}) {
        return this.db.find({ collection: this.collection, search, dbFindOpts: options, findOpts, context });
    }
    /**
     * Find one data entry in a database.
     */
    findOne(search = {}, findOpts = {}, context = {}) {
        return this.db.findOne({ collection: this.collection, search, findOpts, context });
    }
    /**
     * Update data in a database.
     */
    update(search, updater, context = {}) {
        return this.db.update({ collection: this.collection, search, updater, context });
    }
    /**
     * Update one data entry in a database.
     */
    updateOne(search, updater, context = {}) {
        return this.db.updateOne({ collection: this.collection, search, updater, context });
    }
    /**
     * Remove data from a database.
     */
    remove(search, context = {}) {
        return this.db.remove({ collection: this.collection, search, context });
    }
    /**
     * Remove one data entry from a database.
     */
    removeOne(search, context = {}) {
        return this.db.removeOne({ collection: this.collection, search, context });
    }
    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    updateOneOrAdd(search, updater, { add_arg = {}, context = {}, id_gen = true } = {}) {
        return this.db.updateOneOrAdd({ collection: this.collection, search, updater, add_arg, context, id_gen });
    }
    /**
     * Asynchronously removes one entry in a database or adds a new one if it doesn't exist. Usage e.g. for toggling a flag.
     * Returns a promise resolving to `false` if the entry was found and removed,
     * or `true` if the entry was added. The returned value reflects the state of the database
     * after the operation.
     */
    toggleOne(search, data = {}, context = {}) {
        return this.db.toggleOne({ collection: this.collection, search, data, context });
    }
}
