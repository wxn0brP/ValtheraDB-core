import CollectionManager from "../helpers/CollectionManager";
import { ValtheraCompatible } from "../types/valthera";

export function forgeValthera<T extends string>(target: ValtheraCompatible) {
    return new Proxy(target, {
        get(target, prop: string, receiver) {
            if (prop in target) {
                return Reflect.get(target, prop, receiver);
            }

            const collection = new CollectionManager(target, prop);
            target[prop] = collection;
            return collection;
        },

        set(target, prop: string, value, receiver) {
            return Reflect.set(target, prop, value, receiver);
        }
    }) as ValtheraCompatible & { [K in T]: CollectionManager };
};