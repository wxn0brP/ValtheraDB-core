import { Data } from "./types/data.js";
import { FileCpu } from "./types/fileCpu.js";
import * as Query from "./types/query.js";
export type WriteFile = (file: string, data: any[]) => Promise<void>;
export type ReadFile = (file: string) => Promise<any[]>;
export declare function pathRepair(path: string): string;
export declare class CustomFileCpu implements FileCpu {
    _readFile: ReadFile;
    _writeFile: WriteFile;
    constructor(readFile: ReadFile, writeFile: WriteFile);
    add(file: string, config: Query.AddQuery): Promise<void>;
    find(file: string, config: Query.FindQuery): Promise<Data[]>;
    findOne(file: string, config: Query.FindOneQuery): Promise<Data | false>;
    remove(file: string, config: Query.RemoveQuery, one: boolean): Promise<Data[]>;
    update(file: string, config: Query.UpdateQuery, one: boolean): Promise<Data[]>;
}
