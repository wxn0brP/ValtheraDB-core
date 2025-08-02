import { Search, Updater } from "./types/arg.js";
import Data from "./types/data.js";
import FileCpu from "./types/fileCpu.js";
import { FindOpts } from "./types/options.js";
import { VContext } from "./types/types.js";
export type WriteFile = (file: string, data: any[]) => Promise<void>;
export type ReadFile = (file: string) => Promise<any[]>;
export declare function pathRepair(path: string): string;
declare class CustomFileCpu implements FileCpu {
    _readFile: ReadFile;
    _writeFile: WriteFile;
    constructor(readFile: ReadFile, writeFile: WriteFile);
    add(file: string, data: Data): Promise<void>;
    find(file: string, arg: Search, context?: VContext, findOpts?: FindOpts): Promise<any[] | false>;
    findOne(file: string, arg: Search, context?: VContext, findOpts?: FindOpts): Promise<any | false>;
    remove(file: string, one: boolean, arg: Search, context?: VContext): Promise<boolean>;
    update(file: string, one: boolean, arg: Search, updater: Updater, context?: VContext): Promise<boolean>;
}
export default CustomFileCpu;
