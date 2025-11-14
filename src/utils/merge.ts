export function deepMerge(target: any, source: any): any {
    const output = { ...target };
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                if (isObject(source[key])) {
                    if (!target[key]) {
                        output[key] = {};
                    }
                    output[key] = deepMerge(target[key], source[key]);
                } else {
                    output[key] = source[key];
                }
            }
        }
    }
    return output;
}

function isObject(item: any): boolean {
    return item !== null && typeof item === "object" && !Array.isArray(item);
}