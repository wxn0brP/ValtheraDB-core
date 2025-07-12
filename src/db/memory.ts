
import ValtheraClass from "./valthera";
import CustomFileCpu from "../customFileCpu";
import genId from "../helpers/gen";
import dbActionBase from "../base/actions";
import Data from "../types/data";
import FileCpu from "../types/fileCpu";
import { DbOpts } from "../types/options";
import { VQuery } from "../types/query";
import { compareSafe } from "../utils/sort";

export class MemoryAction extends dbActionBase {
    folder: string;
    options: DbOpts;
    fileCpu: FileCpu;
    memory: Map<string, any[]>;

    /**
     * Creates a new instance of dbActionC.
     * @constructor
     * @param folder - The folder where database files are stored.
     * @param options - The options object.
     */
    constructor() {
        super();
        this.memory = new Map();
        this.fileCpu = new CustomFileCpu(this._readMemory.bind(this), this._writeMemory.bind(this));
    }

    _readMemory(key: string) {
        if (!this.memory.has(key)) return [];
        return this.memory.get(key);
    }

    _writeMemory(key: string, data: any[]) {
        this.memory.set(key, data);
    }

    _getCollectionPath(collection: string) {
        return this.folder + "/" + collection + "/";
    }

    /**
     * Get a list of available databases in the specified folder.
     */
    async getCollections() {
        const collections = Array.from(this.memory.keys());
        return collections;
    }

    /**
     * Check and create the specified collection if it doesn't exist.
     */
    async checkCollection({ collection }: VQuery) {
        if (this.issetCollection(collection)) return;
        this.memory.set(collection, []);
        return true;
    }
    /**
     * Check if a collection exists.
     */
    async issetCollection({ collection }: VQuery) {
        return this.memory.has(collection);
    }

    /**
     * Add a new entry to the specified database.
     */
    async add({ collection, data, id_gen = true }: VQuery) {
        await this.checkCollection(arguments[0]);

        if (id_gen) data._id = data._id || genId();
        await this.fileCpu.add(collection, data);
        return data;
    }

    /**
     * Find entries in the specified database based on search criteria.
     */
    async find({ collection, search, context = {}, dbFindOpts = {}, findOpts = {} }: VQuery) {
        const {
            reverse = false,
            max = -1,
            offset = 0,
            sortBy,
            sortAsc = true
        } = dbFindOpts;

        await this.checkCollection(arguments[0]);

        let data = await this.fileCpu.find(collection, search, context, findOpts) as Data[];

        if (reverse) data.reverse();

        if (sortBy) {
            const dir = sortAsc ? 1 : -1;
            data.sort((a, b) => compareSafe(a[sortBy], b[sortBy]) * dir);
        }

        if (offset > 0) {
            if (data.length <= offset) return [];
            data = data.slice(offset);
        }

        if (max !== -1 && data.length > max) {
            data = data.slice(0, max);
        }

        return data;
    }

    /**
     * Find the first matching entry in the specified database based on search criteria.
     */
    async findOne({ collection, search, context = {}, findOpts = {} }: VQuery) {
        await this.checkCollection(arguments[0]);
        let data = await this.fileCpu.findOne(collection, search, context, findOpts) as Data;
        return data || null;
    }

    /**
     * Update entries in the specified database based on search criteria and an updater function or object.
     */
    async update({ collection, search, updater, context = {} }: VQuery) {
        await this.checkCollection(arguments[0]);
        return await this.fileCpu.update(collection, false, search, updater, context);
    }

    /**
     * Update the first matching entry in the specified database based on search criteria and an updater function or object.
     */
    async updateOne({ collection, search, updater, context = {} }: VQuery) {
        await this.checkCollection(arguments[0]);
        return await this.fileCpu.update(collection, true, search, updater, context);
    }

    /**
     * Remove entries from the specified database based on search criteria.
     */
    async remove({ collection, search, context = {} }: VQuery) {
        await this.checkCollection(arguments[0]);
        return await this.fileCpu.remove(collection, false, search, context);
    }

    /**
     * Remove the first matching entry from the specified database based on search criteria.
     */
    async removeOne({ collection, search, context = {} }: VQuery) {
        await this.checkCollection(arguments[0]);
        return await this.fileCpu.remove(collection, true, search, context);
    }

    /**
     * Removes a database collection from the file system.
     */
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

export function createMemoryValthera<T = { [key: string]: Data[] }>(data?: T) {
    const db = new ValtheraMemory();
    if (!data) return db;

    for (const collection of Object.keys(data)) {
        (db.dbAction as MemoryAction).memory.set(collection, data[collection]);
    }

    return db;
}