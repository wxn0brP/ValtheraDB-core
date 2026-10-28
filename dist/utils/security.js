const UNSAFE_KEYS = new Set([
    "__proto__",
    "constructor",
    "prototype",
]);
export function isUnsafeKey(key) {
    return UNSAFE_KEYS.has(key);
}
export function hasUnsafeSegment(path) {
    return path.some(segment => isUnsafeKey(segment));
}
