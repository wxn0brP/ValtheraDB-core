export function convertIdToUnix(id) {
    return parseInt(id.split("-")[0], 36);
}
export function sortByIds(objects, key = "_id") {
    return objects.slice().sort((a, b) => compareIds(a[key], b[key]));
}
/**
 * Sorts an array of objects using reference
 * @param objects
 * @param key default "_id"
 */
export function sortByIdsRef(objects, key = "_id") {
    objects.sort((a, b) => compareIds(a[key], b[key]));
}
export function compareIds(a, b) {
    if (typeof a === "string" && typeof b === "string")
        return convertIdToUnix(a) - convertIdToUnix(b) || a.localeCompare(b);
    if (typeof a === "number" && typeof b === "number")
        return a - b;
    const timeA = typeof a === "string" ? convertIdToUnix(a) : a;
    const timeB = typeof b === "string" ? convertIdToUnix(b) : b;
    return timeA - timeB;
}
