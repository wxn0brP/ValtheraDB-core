import { CustomAdapterBase } from "../base/customAdapter.js";
import { CustomFileCpu } from "../base/customFileCpu.js";
import { hasFieldsAdvanced } from "../utils/hasFieldsAdvanced.js";
export class MemoryAdapter extends CustomAdapterBase {
    memory;
    smartExecutor = true;
    capabilities = {
        transactions: false,
        indexes: false,
        persistent: false,
    };
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
        const search = config.search ?? {};
        return this._readMemory(config.collection).filter(item => hasFieldsAdvanced(item, search)).length;
    }
}
export { 
/** @deprecated Use MemoryAdapter. */
MemoryAdapter as MemoryAction, };
