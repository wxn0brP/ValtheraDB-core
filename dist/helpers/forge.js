export function forgeTypedValthera(target) {
    return new Proxy(target, {
        get(target, prop, receiver) {
            if (prop in target) {
                return Reflect.get(target, prop, receiver);
            }
            return target.c(prop);
        },
        set(target, prop, value, receiver) {
            return Reflect.set(target, prop, value, receiver);
        },
    });
}
