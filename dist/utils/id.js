export function convertIdToUnix(id) {
    return parseInt(id.split("-")[0], 36);
}
export function sortByIds(objects) {
    return objects.slice().sort((a, b) => compareIds(a._id, b._id));
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
