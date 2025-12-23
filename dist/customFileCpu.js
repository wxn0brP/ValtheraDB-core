import hasFieldsAdvanced from "./utils/hasFieldsAdvanced.js";
import updateFindObject from "./utils/updateFindObject.js";
import updateObjectAdvanced from "./utils/updateObject.js";
export function pathRepair(path) {
    return path.replaceAll("//", "/");
}
class CustomFileCpu {
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
        return results.length ? results.map(res => updateFindObject(res, findOpts)) : [];
    }
    async findOne(file, search, context = {}, findOpts = {}) {
        file = pathRepair(file);
        const entries = await this._readFile(file);
        const result = entries.find(entry => typeof search === "function" ? search(entry, context) : hasFieldsAdvanced(entry, search));
        return result ? updateFindObject(result, findOpts) : false;
    }
    async remove(file, one, search, context = {}) {
        file = pathRepair(file);
        let entries = await this._readFile(file);
        let removed = false;
        entries = entries.filter(entry => {
            if (removed && one)
                return true;
            let match = typeof search === "function" ? search(entry, context) : hasFieldsAdvanced(entry, search);
            if (match) {
                removed = true;
                return false;
            }
            return true;
        });
        if (!removed)
            return false;
        await this._writeFile(file, entries);
        return true;
    }
    async update(file, one, search, updater, context = {}) {
        file = pathRepair(file);
        let entries = await this._readFile(file);
        let updated = false;
        entries = entries.map(entry => {
            if (updated && one)
                return entry;
            let match = typeof search === "function" ? search(entry, context) : hasFieldsAdvanced(entry, search);
            if (match) {
                updated = true;
                return typeof updater === "function" ? updater(entry, context) : updateObjectAdvanced(entry, updater);
            }
            return entry;
        });
        if (!updated)
            return false;
        await this._writeFile(file, entries);
        return true;
    }
}
export default CustomFileCpu;
