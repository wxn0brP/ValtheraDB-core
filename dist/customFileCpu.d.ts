import { Data } from "./types/data";
import { FileCpu } from "./types/fileCpu";
import * as Query from "./types/query";
export type WriteFile = (file: string, data: any[]) => Promise<void>;
export type ReadFile = (file: string) => Promise<any[]>;
export declare function pathRepair(path: string): string;
export declare class CustomFileCpu implements FileCpu {
    _readFile: ReadFile;
    _writeFile: WriteFile;
    constructor(readFile: ReadFile, writeFile: WriteFile);
    add(config: Query.AddQuery): Promise<void>;
    find(config: Query.FindQuery): Promise<Data[]>;
    findOne(config: Query.FindOneQuery): Promise<Data | false>;
    remove(config: Query.RemoveQuery, one: boolean): Promise<Data[]>;
    update(config: Query.UpdateQuery, one: boolean): Promise<Data[]>;
}
