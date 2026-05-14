import { match, findProcessLine, update } from "./utils/process.js";
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
        return entries
            .map((entry) => findProcessLine(config, entry))
            .filter(Boolean);
    }
    async findOne(file, config) {
        file = pathRepair(file);
        const entries = await this._readFile(file);
        for (const entry of entries) {
            const result = findProcessLine(config, entry);
            if (result)
                return result;
        }
        return false;
    }
    async remove(file, config, one) {
        file = pathRepair(file);
        let entries = await this._readFile(file);
        const removed = [];
        entries = entries.filter((entry) => {
            if (removed.length && one)
                return true;
            if (match(config, entry)) {
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
        entries = entries.map((entry) => {
            if (updated.length && one)
                return entry;
            if (match(config, entry)) {
                const updatedEntry = update(config, entry);
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
