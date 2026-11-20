import type { Collection } from "../helpers/collection.js";
import type { ValtheraCompatible } from "./valthera.js";
export type DocOf<V> = V extends readonly (infer D)[] ? D : V;
export type TypedCollections<T extends object> = {
    [C in keyof T]: Collection<DocOf<T[C]>>;
};
export type TypedValthera<T extends object, B extends ValtheraCompatible = ValtheraCompatible> = B & TypedCollections<T>;
