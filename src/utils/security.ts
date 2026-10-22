const UNSAFE_KEYS = new Set([
	"__proto__",
	"constructor",
	"prototype",
]);

export function isUnsafeKey(key: string) {
	return UNSAFE_KEYS.has(key);
}

export function hasUnsafeSegment(path: string[]) {
	return path.some(segment => isUnsafeKey(segment));
}
