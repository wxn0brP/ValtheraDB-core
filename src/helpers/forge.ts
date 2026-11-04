import { ValtheraClass } from "../db/valthera";
import { Data } from "../types/data";
import { TypedValthera } from "../types/typed";
import { ValtheraCompatible } from "../types/valthera";
import { isUnsafeKey } from "../utils/security";

function hasApiProperty(target: object, prop: string) {
	if (isUnsafeKey(prop)) return false;

	let current: any = target;
	while (current && current !== Object.prototype) {
		if (Object.hasOwn(current, prop)) return true;
		current = Object.getPrototypeOf(current);
	}
	return false;
}

export function forgeTypedValthera<T extends Record<string, Data>>(
	target: ValtheraClass,
): TypedValthera<T, ValtheraClass>;
export function forgeTypedValthera<T extends Record<string, Data>>(
	target: ValtheraCompatible,
): TypedValthera<T, ValtheraCompatible>;
export function forgeTypedValthera(target: ValtheraClass) {
	return new Proxy(target, {
		get(target, prop: string, receiver) {
			if (typeof prop === "symbol") return Reflect.get(target, prop, receiver);

			if (hasApiProperty(target, prop))
				return Reflect.get(target, prop, receiver);

			return target.c(prop);
		},

		set(target, prop: string, value, receiver) {
			return Reflect.set(target, prop, value, receiver);
		},
	}) as any;
}
