import { Search, Updater } from "./types/arg";
import Data from "./types/data";
import FileCpu from "./types/fileCpu";
import { FindOpts } from "./types/options";
import { VContext } from "./types/types";
export type WriteFile = (file: string, data: any[]) => Promise<void>;
export type ReadFile = (file: string) => Promise<any[]>;
export declare function pathRepair(path: string): string;
declare class CustomFileCpu implements FileCpu {
    _readFile: ReadFile;
    _writeFile: WriteFile;
    constructor(readFile: ReadFile, writeFile: WriteFile);
    add(file: string, data: Data): Promise<void>;
    find(file: string, search: Search, context?: VContext, findOpts?: FindOpts): Promise<any[] | false>;
    findOne(file: string, search: Search, context?: VContext, findOpts?: FindOpts): Promise<any | false>;
    remove(file: string, one: boolean, search: Search, context?: VContext): Promise<boolean>;
    update(file: string, one: boolean, search: Search, updater: Updater, context?: VContext): Promise<boolean>;
}
export default CustomFileCpu;
