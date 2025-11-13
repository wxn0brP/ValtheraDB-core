export function convertIdToUnix(id: string) {
    return parseInt(id.split("-")[0], 36);
}

export function sortByIds<T extends { _id: string }>(objects: T[]) {
    return objects.slice().sort((a, b) => compareIds(a._id, b._id));
}

export function compareIds(a: string | number, b: string | number) {
    if (typeof a === "string" && typeof b === "string")
        return convertIdToUnix(a) - convertIdToUnix(b) || a.localeCompare(b);

    if (typeof a === "number" && typeof b === "number")
        return a - b;

    const timeA = typeof a === "string" ? convertIdToUnix(a) : a;
    const timeB = typeof b === "string" ? convertIdToUnix(b) : b;

    return timeA - timeB;
}