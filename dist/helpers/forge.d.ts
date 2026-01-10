import { CollectionManager } from "./collectionManager.js";
import Data from "../types/data.js";
import { ValtheraCompatible } from "../types/valthera.js";
export declare function forgeValthera<T extends string>(target: ValtheraCompatible): ValtheraCompatible & { [K in T]: CollectionManager; };
export declare function forgeTypedValthera<T extends Record<string, Data>>(target: ValtheraCompatible): ValtheraCompatible & { [K in keyof T]: CollectionManager<T[K]>; };
