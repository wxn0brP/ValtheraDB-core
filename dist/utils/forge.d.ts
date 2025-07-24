import CollectionManager from "../helpers/CollectionManager.js";
import { ValtheraCompatible } from "../types/valthera.js";
export declare function forgeValthera<T extends string>(target: ValtheraCompatible): ValtheraCompatible & { [K in T]: CollectionManager; };
