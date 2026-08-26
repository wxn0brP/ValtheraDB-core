export function _deepMerge(
	target: Record<string, any>,
	...sources: Record<string, any>[]
): Record<string, any> {
	if (!sources.length) return target;
	const source = sources.shift();
	if (!target) target = {};

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key])
					Object.assign(target, {
						[key]: {},
					});
				_deepMerge(target[key], source[key]);
			} else {
				Object.assign(target, {
					[key]: source[key],
				});
			}
		}
	}

	return _deepMerge(target, ...sources);
}

function fastClone(obj: any): any {
	if (obj === null || typeof obj !== "object") return obj;
	if (Array.isArray(obj)) return obj.map(fastClone);
	if (obj instanceof Date) return new Date(obj.getTime());
	const result: any = {};
	for (const key in obj) result[key] = fastClone(obj[key]);
	return result;
}

export function deepMerge(
	target: Record<string, any>,
	...sources: Record<string, any>[]
): Record<string, any> {
	return _deepMerge(fastClone(target), ...sources.map(fastClone));
}

function isObject(item: any): boolean {
	return item && typeof item === "object" && !Array.isArray(item);
}
