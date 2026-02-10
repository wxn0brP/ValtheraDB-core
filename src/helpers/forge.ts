import { Collection } from "./collection";
import { Data } from "../types/data";
import { ValtheraCompatible } from "../types/valthera";

export function forgeValthera<T extends string>(target: ValtheraCompatible) {
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
    }) as ValtheraCompatible & { [K in T]: Collection };
}

export function forgeTypedValthera<T extends Record<string, Data>>(target: ValtheraCompatible) {
    return forgeValthera(target) as ValtheraCompatible & { [K in keyof T]: Collection<T[K]> };
}