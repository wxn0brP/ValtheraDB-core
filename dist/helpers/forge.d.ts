import { Collection } from "./collection";
import { Data } from "../types/data";
import { ValtheraCompatible } from "../types/valthera";
import { ValtheraClass } from "../db/valthera";
export declare function forgeTypedValthera<T extends Record<string, Data>>(target: ValtheraClass): ValtheraClass & {
    [K in keyof T]: Collection<T[K]>;
};
export declare function forgeTypedValthera<T extends Record<string, Data>>(target: ValtheraCompatible): ValtheraCompatible & {
    [K in keyof T]: Collection<T[K]>;
};
