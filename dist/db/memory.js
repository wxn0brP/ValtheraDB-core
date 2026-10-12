import { CustomActionsBase } from "../base/custom.js";
import { CustomFileCpu } from "../customFileCpu.js";
import { forgeTypedValthera } from "../helpers/forge.js";
import { hasFieldsAdvanced } from "../utils/hasFieldsAdvanced.js";
import { ValtheraClass } from "./valthera.js";
export class MemoryAction extends CustomActionsBase {
    memory;
    smartExecutor = true;
    constructor() {
        super();
        this.fileCpu = new CustomFileCpu(this._readMemory.bind(this), this._writeMemory.bind(this), true);
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
        return Array.from(this.memory.keys());
    }
    async ensureCollection(collection) {
        if (this.memory.has(collection))
            return false;
        this.memory.set(collection, []);
        return true;
    }
    async issetCollection(collection) {
        return this.memory.has(collection);
    }
    async removeCollection(collection) {
        if (!this.memory.has(collection))
            return false;
        this.memory.delete(collection);
        return true;
    }
    async count(config) {
        const collection = this._readMemory(config.collection);
        let count = 0;
        for (const item of collection)
            if (hasFieldsAdvanced(item, config.search))
                count++;
        return count;
    }
}
export class ValtheraMemory extends ValtheraClass {
    constructor(...args) {
        super({
            adapter: new MemoryAction(),
        });
    }
}
export function createMemoryValthera(data) {
    const db = new ValtheraMemory();
    if (!data)
        return forgeTypedValthera(db);
    for (const collection of Object.keys(data)) {
        db.adapter.memory.set(collection, data[collection]);
    }
    return forgeTypedValthera(db);
}
