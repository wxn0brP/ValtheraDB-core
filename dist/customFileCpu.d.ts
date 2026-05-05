import { Data } from "./types/data.js";
import { FileCpu } from "./types/fileCpu.js";
import { VQueryT } from "./types/query.js";
export type WriteFile = (file: string, data: any[]) => Promise<void>;
export type ReadFile = (file: string) => Promise<any[]>;
export declare function pathRepair(path: string): string;
export declare class CustomFileCpu implements FileCpu {
    _readFile: ReadFile;
    _writeFile: WriteFile;
    constructor(readFile: ReadFile, writeFile: WriteFile);
    add(file: string, config: VQueryT.Add): Promise<void>;
    find(file: string, config: VQueryT.Find): Promise<Data[]>;
    findOne(file: string, config: VQueryT.FindOne): Promise<Data | false>;
    remove(file: string, config: VQueryT.Remove, one: boolean): Promise<Data[]>;
    update(file: string, config: VQueryT.Update, one: boolean): Promise<Data[]>;
}
