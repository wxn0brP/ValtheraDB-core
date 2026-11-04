import { Data } from "../types/data";
import { TypedValthera } from "../types/typed";
import { ValtheraClass } from "./valthera";
export { MemoryAction, MemoryAdapter, } from "../adapters/memoryAdapter";
export declare class ValtheraMemory extends ValtheraClass {
    constructor(...args: any[]);
}
export declare function createMemoryValthera<T extends Record<string, Data[]>>(data?: T): TypedValthera<T, ValtheraMemory>;
