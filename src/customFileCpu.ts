import { Search, Updater } from "./types/arg";
import { Data } from "./types/data";
import { FileCpu } from "./types/fileCpu";
import { FindOpts } from "./types/options";
import { VContext } from "./types/types";
import { hasFieldsAdvanced } from "./utils/hasFieldsAdvanced";
import { updateFindObject } from "./utils/updateFindObject";
import { updateObjectAdvanced } from "./utils/updateObject";

export type WriteFile = (file: string, data: any[]) => Promise<void>
export type ReadFile = (file: string) => Promise<any[]>


export function pathRepair(path: string) {
    return path.replaceAll("//", "/");
}

export class CustomFileCpu implements FileCpu {
    _readFile: ReadFile;
    _writeFile: WriteFile;

    constructor(readFile: ReadFile, writeFile: WriteFile) {
        this._readFile = readFile;
        this._writeFile = writeFile;
    }

    async add(file: string, data: Data): Promise<void> {
        file = pathRepair(file);
        let entries = await this._readFile(file);
        entries.push(data);
        await this._writeFile(file, entries);
    }

    async find(file: string, search: Search, context: VContext = {}, findOpts: FindOpts = {}): Promise<Data[]> {
        file = pathRepair(file);
        const entries = await this._readFile(file);
        const results = entries.filter(entry =>
            typeof search === "function" ? search(entry, context) : hasFieldsAdvanced(entry, search)
        );
        return results.length ? results.map(res => updateFindObject(res, findOpts)) : [];
    }

    async findOne(file: string, search: Search, context: VContext = {}, findOpts: FindOpts = {}): Promise<Data | false> {
        file = pathRepair(file);
        const entries = await this._readFile(file);
        const result = entries.find(entry =>
            typeof search === "function" ? search(entry, context) : hasFieldsAdvanced(entry, search)
        );
        return result ? updateFindObject(result, findOpts) : false;
    }

    async remove(file: string, one: boolean, search: Search, context: VContext = {}): Promise<Data[]> {
        file = pathRepair(file);
        let entries = await this._readFile(file);
        const removed = [];

        entries = entries.filter(entry => {
            if (removed.length && one) return true;

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

    async update(file: string, one: boolean, search: Search, updater: Updater, context: VContext = {}): Promise<Data[]> {
        file = pathRepair(file);
        let entries = await this._readFile(file);
        const updated = [];

        entries = entries.map(entry => {
            if (updated.length && one) return entry;

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