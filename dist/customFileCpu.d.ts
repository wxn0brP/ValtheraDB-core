import { Search, Updater } from "./types/arg.js";
import { Data } from "./types/data.js";
import { FileCpu } from "./types/fileCpu.js";
import { FindOpts } from "./types/options.js";
import { VContext } from "./types/types.js";
export type WriteFile = (file: string, data: any[]) => Promise<void>;
export type ReadFile = (file: string) => Promise<any[]>;
export declare function pathRepair(path: string): string;
export declare class CustomFileCpu implements FileCpu {
    _readFile: ReadFile;
    _writeFile: WriteFile;
    constructor(readFile: ReadFile, writeFile: WriteFile);
    add(file: string, data: Data): Promise<void>;
    find(file: string, search: Search, context?: VContext, findOpts?: FindOpts): Promise<Data[]>;
    findOne(file: string, search: Search, context?: VContext, findOpts?: FindOpts): Promise<Data | false>;
    remove(file: string, one: boolean, search: Search, context?: VContext): Promise<Data[]>;
    update(file: string, one: boolean, search: Search, updater: Updater, context?: VContext): Promise<Data[]>;
}
