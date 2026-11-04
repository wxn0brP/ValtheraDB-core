import { QueryValidationError } from "../errors";

/**
 * Checks if an object matches the standard field comparison.
 * @param obj - The object to check.
 * @param fields - Criteria to compare.
 * @returns Whether the object matches the criteria.
 */
export function hasFields(obj: Object, fields: Object): boolean {
	if (obj === null || obj === undefined) return false;
	if (fields === null || typeof fields !== "object")
		throw new QueryValidationError("Fields must be an object", {
			op: "search",
		});

	const keys = Object.keys(fields);
	return keys.every(key => {
		if (Object.hasOwn(obj, key)) {
			if (typeof fields[key] === "object" && fields[key] !== null) {
				return hasFields(obj[key], fields[key]);
			}
			return obj[key] === fields[key];
		}
		return false;
	});
}
