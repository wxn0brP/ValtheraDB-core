import { Collection } from "./collection";
import { Data } from "../types/data";
import { ValtheraCompatible } from "../types/valthera";
import { ValtheraClass } from "../db/valthera";

export function forgeValthera<T extends string>(target: ValtheraClass): ValtheraClass & { [K in T]: Collection };
export function forgeValthera<T extends string>(target: ValtheraCompatible): ValtheraCompatible & { [K in T]: Collection };
export function forgeValthera(target: ValtheraClass) {
    return forgeTypedValthera(target) as any;
}

export function forgeTypedValthera<T extends Record<string, Data>>(target: ValtheraClass): ValtheraClass & { [K in keyof T]: Collection<T[K]> };
export function forgeTypedValthera<T extends Record<string, Data>>(target: ValtheraCompatible): ValtheraCompatible & { [K in keyof T]: Collection<T[K]> };
export function forgeTypedValthera(target: ValtheraClass) {
    return new Proxy(target, {
        get(target, prop: string, receiver) {
            if (prop in target) {
                return Reflect.get(target, prop, receiver);
            }

            const collection = new Collection(target, prop);
            target[prop] = collection;
            return collection;
        },

        set(target, prop: string, value, receiver) {
            return Reflect.set(target, prop, value, receiver);
        }
    }) as any;
}
