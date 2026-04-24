import { CustomActionsBase } from "../base/custom.js";
import { Collection } from "../helpers/collection.js";
import { Data } from "../types/data.js";
import { ValtheraClass } from "./valthera.js";
export declare class MemoryAction extends CustomActionsBase {
    memory: Map<string, any[]>;
    constructor();
    _readMemory(key: string): any[];
    _writeMemory(key: string, data: any[]): void;
    getCollections(): Promise<string[]>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    removeCollection(collection: string): Promise<boolean>;
}
export declare class ValtheraMemory extends ValtheraClass {
    constructor(...args: any[]);
}
export declare function createMemoryValthera<T extends Record<string, Data[]>>(data?: T): ValtheraMemory & {
    [K in keyof T]: Collection<T[K][number]>;
};
