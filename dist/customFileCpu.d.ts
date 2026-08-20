import { Data, DataInternal } from "./types/data";
import { FileCpu } from "./types/fileCpu";
import { VQueryT } from "./types/query";
export type WriteFile = (file: string, data: any[]) => Promise<void>;
export type ReadFile = (file: string) => Promise<any[]>;
export declare function pathRepair(path: string): string;
export declare class CustomFileCpu implements FileCpu {
    _readFile: ReadFile;
    _writeFile: WriteFile;
    constructor(readFile: ReadFile, writeFile: WriteFile);
    add(file: string, config: VQueryT.Add): Promise<void>;
    find(file: string, config: VQueryT.Find): Promise<Data[]>;
    findOne(file: string, config: VQueryT.FindOne): Promise<DataInternal | false>;
    remove(file: string, config: VQueryT.Remove, one: boolean): Promise<DataInternal[]>;
    update(file: string, config: VQueryT.Update, one: boolean): Promise<DataInternal[]>;
}
