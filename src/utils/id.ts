export function convertIdToUnix(id: string) {
	return parseInt(id.split("-")[0], 36);
}

/**
 * Sorts an array of objects by their _id property
 */
export function sortByIds<
	T extends {
		_id: string;
	},
>(objects: T[]): T[];
export function sortByIds<T extends Record<string, any>>(
	objects: T[],
	key: string,
): T[];
export function sortByIds<
	T extends {
		_id: string;
	},
>(objects: T[], key = "_id") {
	return objects.slice().sort((a, b) => compareIds(a[key], b[key]));
}

/**
 * Sorts an array of objects using reference
 * @param objects
 * @param key default "_id"
 */
export function sortByIdsRef(objects: Record<string, any>[], key = "_id") {
	objects.sort((a, b) => compareIds(a[key], b[key]));
}

export function compareIds(a: string | number, b: string | number) {
	if (typeof a === "string" && typeof b === "string")
		return convertIdToUnix(a) - convertIdToUnix(b) || a.localeCompare(b);

	if (typeof a === "number" && typeof b === "number") return a - b;

	const timeA = typeof a === "string" ? convertIdToUnix(a) : a;
	const timeB = typeof b === "string" ? convertIdToUnix(b) : b;

	return timeA - timeB;
}
