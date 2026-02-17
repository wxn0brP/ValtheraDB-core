import { hasFieldsAdvanced } from "./utils/hasFieldsAdvanced.js";
import { updateFindObject } from "./utils/updateFindObject.js";
import { updateObjectAdvanced } from "./utils/updateObject.js";
export function pathRepair(path) {
    return path.replaceAll("//", "/");
}
export class CustomFileCpu {
    _readFile;
    _writeFile;
    constructor(readFile, writeFile) {
        this._readFile = readFile;
        this._writeFile = writeFile;
    }
    async add(file, data) {
        file = pathRepair(file);
        let entries = await this._readFile(file);
        entries.push(data);
        await this._writeFile(file, entries);
    }
    async find(file, search, context = {}, findOpts = {}) {
        file = pathRepair(file);
        const entries = await this._readFile(file);
        const results = entries.filter(entry => typeof search === "function" ? search(entry, context) : hasFieldsAdvanced(entry, search));
        return results.length ?
            results.map(res => updateFindObject(res, findOpts)) :
            [];
    }
    async findOne(file, search, context = {}, findOpts = {}) {
        file = pathRepair(file);
        const entries = await this._readFile(file);
        const result = entries.find(entry => typeof search === "function" ? search(entry, context) : hasFieldsAdvanced(entry, search));
        return result ?
            updateFindObject(result, findOpts) :
            false;
    }
    async remove(file, one, search, context = {}) {
        file = pathRepair(file);
        let entries = await this._readFile(file);
        const removed = [];
        entries = entries.filter(entry => {
            if (removed.length && one)
                return true;
            let match = typeof search === "function" ? search(entry, context) : hasFieldsAdvanced(entry, search);
            if (match) {
                removed.push(entry);
                return false;
            }
            return true;
        });
        if (removed.length)
            await this._writeFile(file, entries);
        return removed;
    }
    async update(file, one, search, updater, context = {}) {
        file = pathRepair(file);
        let entries = await this._readFile(file);
        const updated = [];
        entries = entries.map(entry => {
            if (updated.length && one)
                return entry;
            let match = typeof search === "function" ? search(entry, context) : hasFieldsAdvanced(entry, search);
            if (match) {
                const updatedEntry = typeof updater === "function" ? updater(entry, context) : updateObjectAdvanced(entry, updater);
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
