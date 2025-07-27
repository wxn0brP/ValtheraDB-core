export function sortByIds<T extends { _id: string }>(objects: T[]) {
    return objects.slice().sort((a, b) => {
        const [timestampA] = a._id.split("-");
        const [timestampB] = b._id.split("-");

        return timestampA.localeCompare(timestampB) || a._id.localeCompare(b._id);
    });
}