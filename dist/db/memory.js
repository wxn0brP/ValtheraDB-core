import { CustomActionsBase } from "../base/custom.js";
import CustomFileCpu from "../customFileCpu.js";
import ValtheraClass from "./valthera.js";
export class MemoryAction extends CustomActionsBase {
    memory;
    constructor() {
        super();
        this.fileCpu = new CustomFileCpu(this._readMemory.bind(this), this._writeMemory.bind(this));
        this.memory = new Map();
    }
    _readMemory(key) {
        if (!this.memory.has(key))
            return [];
        return this.memory.get(key);
    }
    _writeMemory(key, data) {
        this.memory.set(key, data);
    }
    async getCollections() {
        const collections = Array.from(this.memory.keys());
        return collections;
    }
    async ensureCollection({ collection }) {
        if (this.issetCollection(collection))
            return;
        this.memory.set(collection, []);
        return true;
    }
    async issetCollection({ collection }) {
        return this.memory.has(collection);
    }
    async removeCollection({ collection }) {
        this.memory.delete(collection);
        return true;
    }
}
export default class ValtheraMemory extends ValtheraClass {
    constructor(...args) {
        super({ dbAction: new MemoryAction() });
    }
}
export function createMemoryValthera(data) {
    const db = new ValtheraMemory();
    if (!data)
        return db;
    for (const collection of Object.keys(data)) {
        db.dbAction.memory.set(collection, data[collection]);
    }
    return db;
}
