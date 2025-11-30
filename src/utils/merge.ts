export function _deepMerge(target: Record<string, any>, ...sources: Record<string, any>[]): Record<string, any> {
    if (!sources.length) return target;
    const source = sources.shift();
    if (!target) target = {};

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                _deepMerge(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return _deepMerge(target, ...sources);
}

export function deepMerge(target: Record<string, any>, ...sources: Record<string, any>[]): Record<string, any> {
    return _deepMerge(structuredClone(target), ...sources.map(s => structuredClone(s)));
}

function isObject(item: any): boolean {
    return (item && typeof item === "object" && !Array.isArray(item));
}