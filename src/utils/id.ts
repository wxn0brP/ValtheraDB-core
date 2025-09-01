export function convertIdToUnix(id: string) {
    return parseInt(id.split("-")[0], 36);
}

export function sortByIds<T extends { _id: string }>(objects: T[]) {
    return objects.slice().sort((a, b) => {
        return convertIdToUnix(a._id) - convertIdToUnix(b._id) || a._id.localeCompare(b._id);
    });
}