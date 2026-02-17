import { CustomActionsBase } from "../base/custom";
import { Collection } from "../helpers/collection";
import { Data } from "../types/data";
import { VQuery } from "../types/query";
import { ValtheraClass } from "./valthera";
export declare class MemoryAction extends CustomActionsBase {
    memory: Map<string, any[]>;
    constructor();
    _readMemory(key: string): any[];
    _writeMemory(key: string, data: any[]): void;
    getCollections(): Promise<string[]>;
    ensureCollection({ collection }: VQuery): Promise<boolean>;
    issetCollection({ collection }: VQuery): Promise<boolean>;
    removeCollection({ collection }: VQuery): Promise<boolean>;
}
export declare class ValtheraMemory extends ValtheraClass {
    constructor(...args: any[]);
}
export declare function createMemoryValthera<T extends Record<string, Data[]>>(data?: T): ValtheraMemory & {
    [K in keyof T]: Collection<T[K][number]>;
};
