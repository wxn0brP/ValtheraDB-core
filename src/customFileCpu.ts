import { Data } from "./types/data";
import { FileCpu } from "./types/fileCpu";
import * as Query from "./types/query";
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

    async add(config: Query.AddQuery): Promise<void> {
        const file = pathRepair(config.collection);
        let entries = await this._readFile(file);
        entries.push(config.data);
        await this._writeFile(file, entries);
    }

    async find(config: Query.FindQuery): Promise<Data[]> {
        const file = pathRepair(config.collection);
        const entries = await this._readFile(file);

        const { search, context = {}, findOpts = {} } = config;

        const results = entries.filter(entry =>
            typeof search === "function" ? search(entry, context) : hasFieldsAdvanced(entry, search)
        );

        return results.length ?
            results.map(res => updateFindObject(res, findOpts)) :
            [];
    }

    async findOne(config: Query.FindOneQuery): Promise<Data | false> {
        const file = pathRepair(config.collection);
        const entries = await this._readFile(file);

        const { search, context = {}, findOpts = {} } = config;

        const result = entries.find(entry =>
            typeof search === "function" ? search(entry, context) : hasFieldsAdvanced(entry, search)
        );
        return result ?
            updateFindObject(result, findOpts) :
            false;
    }

    async remove(config: Query.RemoveQuery, one: boolean): Promise<Data[]> {
        const file = pathRepair(config.collection);
        let entries = await this._readFile(file);
        const removed = [];

        const { search, context = {} } = config;

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

    async update(config: Query.UpdateQuery, one: boolean): Promise<Data[]> {
        const file = pathRepair(config.collection);
        let entries = await this._readFile(file);
        const updated = [];

        const { search, updater, context = {} } = config;

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
