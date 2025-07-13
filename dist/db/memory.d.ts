import ValtheraClass from "./valthera";
import dbActionBase from "../base/actions";
import Data from "../types/data";
import FileCpu from "../types/fileCpu";
import { DbOpts } from "../types/options";
import { VQuery } from "../types/query";
export declare class MemoryAction extends dbActionBase {
    folder: string;
    options: DbOpts;
    fileCpu: FileCpu;
    memory: Map<string, any[]>;
    constructor();
    _readMemory(key: string): any[];
    _writeMemory(key: string, data: any[]): void;
    _getCollectionPath(collection: string): string;
    getCollections(): Promise<string[]>;
    checkCollection({ collection }: VQuery): Promise<boolean>;
    issetCollection({ collection }: VQuery): Promise<boolean>;
    add({ collection, data, id_gen }: VQuery): Promise<import("../types/arg").Arg>;
    find(query: VQuery): Promise<Data[]>;
    findOne({ collection, search, context, findOpts }: VQuery): Promise<Data>;
    update({ collection, search, updater, context }: VQuery): Promise<boolean>;
    updateOne({ collection, search, updater, context }: VQuery): Promise<boolean>;
    remove({ collection, search, context }: VQuery): Promise<boolean>;
    removeOne({ collection, search, context }: VQuery): Promise<boolean>;
    removeCollection({ collection }: VQuery): Promise<boolean>;
}
export default class ValtheraMemory extends ValtheraClass {
    constructor(...args: any[]);
}
export declare function createMemoryValthera<T extends Record<string, Data[]>>(data?: T): ValtheraMemory;
