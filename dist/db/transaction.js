import { Collection } from "../helpers/collection.js";
import { applyAddDefaults, applyFindDefaults, applyFindOneDefaults, applyRemoveDefaults, applyToggleOneDefaults, applyUpdateDefaults, applyUpdateOneOrAddDefaults, } from "../helpers/queryDefaults.js";
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
    ensureCollection(collection) {
        return this._parent.adapter.ensureCollection(collection);
    }
    issetCollection(collection) {
        return this._parent.adapter.issetCollection(collection);
    }
    getCollections() {
        return this._parent.adapter.getCollections();
    }
    removeCollection(collection) {
        return this._parent.adapter.removeCollection(collection);
    }
    async commit() {
        await this._parent.adapter.commitTransaction(this.handle);
    }
    async rollback() {
        await this._parent.adapter.rollbackTransaction(this.handle);
    }
}
