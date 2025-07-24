
import { CustomActionsBase } from "../base/custom";
import CustomFileCpu from "../customFileCpu";
import CollectionManager from "../helpers/CollectionManager";
import Data from "../types/data";
import { VQuery } from "../types/query";
import { forgeValthera } from "../helpers/forge";
import ValtheraClass from "./valthera";

export class MemoryAction extends CustomActionsBase {
    memory: Map<string, any[]>;

    constructor() {
        super();
        this.fileCpu = new CustomFileCpu(this._readMemory.bind(this), this._writeMemory.bind(this));
        this.memory = new Map();
    }

    _readMemory(key: string) {
        if (!this.memory.has(key)) return [];
        return this.memory.get(key);
    }

    _writeMemory(key: string, data: any[]) {
        this.memory.set(key, data);
    }

    async getCollections() {
        const collections = Array.from(this.memory.keys());
        return collections;
    }

    async ensureCollection({ collection }: VQuery) {
        if (this.issetCollection(collection)) return;
        this.memory.set(collection, []);
        return true;
    }

    async issetCollection({ collection }: VQuery) {
        return this.memory.has(collection);
    }

    async removeCollection({ collection }: VQuery) {
        this.memory.delete(collection);
        return true;
    }
}

export default class ValtheraMemory extends ValtheraClass {
    constructor(...args: any[]) {
        super({ dbAction: new MemoryAction() });
    }
}

export function createMemoryValthera<T extends Record<string, Data[]>>
    (data?: T): ValtheraMemory & { [K in keyof T]: CollectionManager<T[K][number]> } {

    const db = new ValtheraMemory();
    if (!data) return forgeValthera(db) as any;

    for (const collection of Object.keys(data)) {
        (db.dbAction as MemoryAction).memory.set(collection, data[collection]);
    }

    return forgeValthera(db) as any;
}