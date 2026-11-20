import { ValtheraClass } from "../db/valthera";
import { Data } from "../types/data";
import { TypedValthera } from "../types/typed";
import { ValtheraCompatible } from "../types/valthera";
export declare function forgeTypedValthera<T extends Record<string, Data>>(target: ValtheraClass): TypedValthera<T, ValtheraClass>;
export declare function forgeTypedValthera<T extends Record<string, Data>>(target: ValtheraCompatible): TypedValthera<T, ValtheraCompatible>;
