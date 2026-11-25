import { Data } from "../types/data.js";
import { TypedValthera } from "../types/typed.js";
import { ValtheraClass } from "./valthera.js";
export declare class ValtheraMemory extends ValtheraClass {
    constructor(...args: any[]);
}
export declare function createMemoryValthera<T extends Record<string, Data[]>>(data?: T): TypedValthera<T, ValtheraMemory>;
