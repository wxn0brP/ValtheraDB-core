import { wrapAdapterError } from "../errors.js";
import { Collection, resolveCollection } from "../helpers/collection.js";
import { applyAddDefaults, applyBulkAddDefaults, applyCountDefaults, applyFindDefaults, applyFindOneDefaults, applyRemoveDefaults, applyToggleOneDefaults, applyUpdateDefaults, applyUpdateOneOrAddDefaults, } from "../helpers/queryDefaults.js";
/**
 * Transaction context. Operations are executed directly through the parent
 * database with the transaction handle passed to the executor.
 */
export class Transaction {
    handle;
    _parent;
    constructor(handle, _parent) {
        this.handle = handle;
        this._parent = _parent;
    }
    c(name) {
        return new Collection(this, name);
    }
    add(q) {
        applyAddDefaults(q);
        return this._parent.execute("add", q, this.handle);
    }
    bulkAdd(q) {
        applyBulkAddDefaults(q);
        return this._parent.execute("bulkAdd", q, this.handle);
    }
    find(q) {
        applyFindDefaults(q);
        return this._parent.execute("find", q, this.handle);
    }
    findOne(q) {
        applyFindOneDefaults(q);
        return this._parent.execute("findOne", q, this.handle);
    }
    update(q) {
        applyUpdateDefaults(q);
        return this._parent.execute("update", q, this.handle);
    }
    updateOne(q) {
        applyUpdateDefaults(q);
        return this._parent.execute("updateOne", q, this.handle);
    }
    remove(q) {
        applyRemoveDefaults(q);
        return this._parent.execute("remove", q, this.handle);
    }
    removeOne(q) {
        applyRemoveDefaults(q);
        return this._parent.execute("removeOne", q, this.handle);
    }
    updateOneOrAdd(q) {
        applyUpdateOneOrAddDefaults(q);
        return this._parent.execute("updateOneOrAdd", q, this.handle);
    }
    toggleOne(q) {
        applyToggleOneDefaults(q);
        return this._parent.execute("toggleOne", q, this.handle);
    }
    count(q) {
        applyCountDefaults(q);
        return this._parent.execute("count", q, this.handle);
    }
    ensureCollection(collection) {
        return this._parent.execute("ensureCollection", resolveCollection(collection), this.handle);
    }
    issetCollection(collection) {
        return this._parent.execute("issetCollection", resolveCollection(collection), this.handle);
    }
    getCollections() {
        return this._parent.execute("getCollections", {}, this.handle);
    }
    removeCollection(target) {
        return this._parent.execute("removeCollection", resolveCollection(target), this.handle);
    }
    async commit() {
        try {
            await this._parent.adapter.commitTransaction(this.handle);
        }
        catch (err) {
            throw wrapAdapterError(err, {
                op: "commitTransaction",
                adapter: this._parent.adapter?.version,
            });
        }
    }
    async rollback() {
        try {
            await this._parent.adapter.rollbackTransaction(this.handle);
        }
        catch (err) {
            throw wrapAdapterError(err, {
                op: "rollbackTransaction",
                adapter: this._parent.adapter?.version,
            });
        }
    }
}
