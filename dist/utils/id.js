export function convertIdToUnix(id) {
    return parseInt(id.split("-")[0], 36);
}
export function sortByIds(objects) {
    return objects.slice().sort((a, b) => {
        return convertIdToUnix(a._id) - convertIdToUnix(b._id) || a._id.localeCompare(b._id);
    });
}
