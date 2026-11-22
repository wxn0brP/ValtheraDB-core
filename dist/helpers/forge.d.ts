import { ValtheraClass } from "../db/valthera.js";
import { Data } from "../types/data.js";
import { TypedValthera } from "../types/typed.js";
import { ValtheraCompatible } from "../types/valthera.js";
export declare function forgeTypedValthera<T extends Record<string, Data>>(target: ValtheraClass): TypedValthera<T, ValtheraClass>;
export declare function forgeTypedValthera<T extends Record<string, Data>>(target: ValtheraCompatible): TypedValthera<T, ValtheraCompatible>;
