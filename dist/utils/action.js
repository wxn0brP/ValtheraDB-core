import { compareSafe } from "./compare.js";
export async function findUtil(query, fileCpu, files) {
    const { search, context = {}, dbFindOpts = {}, findOpts = {} } = query;
    const { reverse = false, offset = 0, limit = -1, sortBy, sortAsc = true } = dbFindOpts;
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
            if (limit !== -1) {
                if (totalEntries + entries.length > limit) {
                    const remaining = limit - totalEntries;
                    entries = entries.slice(0, remaining);
                    totalEntries = limit;
                }
                else {
                    totalEntries += entries.length;
                }
            }
            datas.push(...entries);
            if (limit !== -1 && totalEntries >= limit)
                break;
        }
        else {
            datas.push(...entries);
        }
    }
    if (sortBy) {
        if (sortBy === "random()") {
            datas.sort(() => Math.random() - 0.5);
        }
        else {
            const dir = sortAsc ? 1 : -1;
            datas.sort((a, b) => compareSafe(a[sortBy], b[sortBy]) * dir);
        }
        const start = offset;
        const end = limit !== -1 ? offset + limit : undefined;
        datas = datas.slice(start, end);
    }
    return datas;
}
