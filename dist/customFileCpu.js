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
    async add(file, config) {
        file = pathRepair(file);
        let entries = await this._readFile(file);
        entries.push(config.data);
        await this._writeFile(file, entries);
    }
    async find(file, config) {
        file = pathRepair(file);
        const entries = await this._readFile(file);
        const { search, context = {}, findOpts = {} } = config;
        const results = entries.filter(entry => typeof search === "function" ? search(entry, context) : hasFieldsAdvanced(entry, search));
        return results.length ?
            results.map(res => updateFindObject(res, findOpts)) :
            [];
    }
    async findOne(file, config) {
        file = pathRepair(file);
        const entries = await this._readFile(file);
        const { search, context = {}, findOpts = {} } = config;
        const result = entries.find(entry => typeof search === "function" ? search(entry, context) : hasFieldsAdvanced(entry, search));
        return result ?
            updateFindObject(result, findOpts) :
            false;
    }
    async remove(file, config, one) {
        file = pathRepair(file);
        let entries = await this._readFile(file);
        const removed = [];
        const { search, context = {} } = config;
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
    async update(file, config, one) {
        file = pathRepair(file);
        let entries = await this._readFile(file);
        const updated = [];
        const { search, updater, context = {} } = config;
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
