import CollectionManager from "../helpers/CollectionManager.js";
export function forgeValthera(target) {
    return new Proxy(target, {
        get(target, prop, receiver) {
            if (prop in target) {
                return Reflect.get(target, prop, receiver);
            }
            const collection = new CollectionManager(target, prop);
            target[prop] = collection;
            return collection;
        },
        set(target, prop, value, receiver) {
            return Reflect.set(target, prop, value, receiver);
        }
    });
}
export function forgeTypedValthera(target) {
    return forgeValthera(target);
}
