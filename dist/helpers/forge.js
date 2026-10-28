import { isUnsafeKey } from "../utils/security.js";
function hasApiProperty(target, prop) {
    if (isUnsafeKey(prop))
        return false;
    let current = target;
    while (current && current !== Object.prototype) {
        if (Object.hasOwn(current, prop))
            return true;
        current = Object.getPrototypeOf(current);
    }
    return false;
}
export function forgeTypedValthera(target) {
    return new Proxy(target, {
        get(target, prop, receiver) {
            if (typeof prop === "symbol")
                return Reflect.get(target, prop, receiver);
            if (hasApiProperty(target, prop))
                return Reflect.get(target, prop, receiver);
            return target.c(prop);
        },
        set(target, prop, value, receiver) {
            return Reflect.set(target, prop, value, receiver);
        },
    });
}
