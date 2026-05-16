import { Data, DataInternal } from "./types/data";
import { FileCpu } from "./types/fileCpu";
import { VQueryT } from "./types/query";
import { matchObj, findObj, updateObj } from "./utils/process";

export type WriteFile = (file: string, data: any[]) => Promise<void>;
export type ReadFile = (file: string) => Promise<any[]>;

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

    async add(file: string, config: VQueryT.Add): Promise<void> {
        file = pathRepair(file);
        let entries = await this._readFile(file);
        entries.push(config.data);
        await this._writeFile(file, entries);
    }

    async find(file: string, config: VQueryT.Find): Promise<Data[]> {
        file = pathRepair(file);
        const entries = await this._readFile(file);

        return entries
            .map((entry) => findObj(config, entry))
            .filter(Boolean);
    }

    async findOne(
        file: string,
        config: VQueryT.FindOne,
    ): Promise<DataInternal | false> {
        file = pathRepair(file);
        const entries = await this._readFile(file);

        for (const entry of entries) {
            const result = findObj(config, entry);
            if (result) return result;
        }
        return false;
    }

    async remove(
        file: string,
        config: VQueryT.Remove,
        one: boolean,
    ): Promise<DataInternal[]> {
        file = pathRepair(file);
        let entries = await this._readFile(file);
        const removed = [];

        entries = entries.filter((entry) => {
            if (removed.length && one) return true;

            if (matchObj(config, entry)) {
                removed.push(entry);
                return false;
            }

            return true;
        });

        if (removed.length) await this._writeFile(file, entries);

        return removed;
    }

    async update(
        file: string,
        config: VQueryT.Update,
        one: boolean,
    ): Promise<DataInternal[]> {
        file = pathRepair(file);
        let entries = await this._readFile(file);
        const updated = [];

        entries = entries.map((entry) => {
            if (updated.length && one) return entry;

            if (matchObj(config, entry)) {
                const updatedEntry = updateObj(config, entry);
                updated.push(updatedEntry);
                return updatedEntry;
            }

            return entry;
        });

        if (updated.length) await this._writeFile(file, entries);

        return updated;
    }
}
