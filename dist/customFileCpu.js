import { matchObj, updateObj } from "./utils/process.js";
import { updateFindObject } from "./utils/updateFindObject.js";
export function pathRepair(path) {
    return path.replace(/\/+/g, "/");
}
export class CustomFileCpu {
    requireClone;
    _readFile;
    _writeFile;
    constructor(readFile, writeFile, requireClone = false) {
        this.requireClone = requireClone;
        this._readFile = readFile;
        this._writeFile = writeFile;
    }
    async add(file, config) {
        file = pathRepair(file);
        const entries = await this._readFile(file);
        entries.push(config.data);
        await this._writeFile(file, entries);
    }
    async find(file, config) {
        file = pathRepair(file);
        const entries = await this._readFile(file);
        const result = entries.filter(entry => matchObj(config, entry));
        const objs = this.requireClone ? structuredClone(result) : result;
        return objs.map(obj => updateFindObject(obj, config.findOpts || {}));
    }
    async findOne(file, config) {
        file = pathRepair(file);
        const entries = await this._readFile(file);
        for (const entry of entries) {
            const isMatch = matchObj(config, entry);
            if (!isMatch)
                continue;
            const obj = this.requireClone ? structuredClone(entry) : entry;
            return updateFindObject(obj, config.findOpts || {});
        }
        return false;
    }
    async remove(file, config, one) {
        file = pathRepair(file);
        let entries = await this._readFile(file);
        const removed = [];
        entries = entries.filter(entry => {
            if (removed.length && one)
                return true;
            if (matchObj(config, entry)) {
                removed.push(entry);
                return false;
            }
            return true;
        });
        if (removed.length)
            await this._writeFile(file, entries);
        return removed;
    }
    async update(file, config, one) {
        file = pathRepair(file);
        let entries = await this._readFile(file);
        const updated = [];
        entries = entries.map(entry => {
            if (updated.length && one)
                return entry;
            if (matchObj(config, entry)) {
                const updatedEntry = updateObj(config, entry);
                updated.push(updatedEntry);
                return updatedEntry;
            }
            return entry;
        });
        if (updated.length)
            await this._writeFile(file, entries);
        return updated;
    }
}
