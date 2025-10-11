import { compareSafe } from "./sort.js";
export async function findUtil(query, fileCpu, files) {
    const { search, context = {}, dbFindOpts = {}, findOpts = {} } = query;
    const { reverse = false, max = -1, offset = 0, sortBy, sortAsc = true } = dbFindOpts;
    if (reverse && !sortBy)
        files.reverse();
    let datas = [];
    let totalEntries = 0;
    let skippedEntries = 0;
    for (const f of files) {
        let entries = await fileCpu.find(f, search, context, findOpts);
        if (reverse && !sortBy)
            entries.reverse();
        if (!sortBy) {
            if (offset > skippedEntries) {
                const remainingSkip = offset - skippedEntries;
                if (entries.length <= remainingSkip) {
                    skippedEntries += entries.length;
                    continue;
                }
                entries = entries.slice(remainingSkip);
                skippedEntries = offset;
            }
            if (max !== -1) {
                if (totalEntries + entries.length > max) {
                    const remaining = max - totalEntries;
                    entries = entries.slice(0, remaining);
                    totalEntries = max;
                }
                else {
                    totalEntries += entries.length;
                }
            }
            datas.push(...entries);
            if (max !== -1 && totalEntries >= max)
                break;
        }
        else {
            datas.push(...entries);
        }
    }
    if (sortBy) {
        const dir = sortAsc ? 1 : -1;
        datas.sort((a, b) => compareSafe(a[sortBy], b[sortBy]) * dir);
        const start = offset;
        const end = max !== -1 ? offset + max : undefined;
        datas = datas.slice(start, end);
    }
    return datas;
}
