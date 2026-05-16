import { compareSafe } from "./compare.js";
export async function findUtil(query, fileCpuOrData, files) {
    const { dbFindOpts = {} } = query;
    const { reverse = false, offset = 0, limit = -1, sortBy, sortAsc = true, min, max, avg, groupBy, count, } = dbFindOpts;
    const needsAllData = min || max || avg || groupBy || count || sortBy;
    let datas = [];
    let skippedEntries = 0;
    if (Array.isArray(fileCpuOrData)) {
        datas = [...fileCpuOrData];
    }
    else {
        const filesToProcess = reverse && !sortBy ? [...files].reverse() : files;
        for (const f of filesToProcess) {
            let entries = await fileCpuOrData.find(f, query);
            if (reverse && !sortBy)
                entries.reverse();
            if (needsAllData) {
                datas.push(...entries);
                continue;
            }
            if (offset > skippedEntries) {
                const toSkip = offset - skippedEntries;
                if (entries.length <= toSkip) {
                    skippedEntries += entries.length;
                    continue;
                }
                entries = entries.slice(toSkip);
                skippedEntries = offset;
            }
            if (limit !== -1) {
                const remaining = limit - datas.length;
                if (entries.length > remaining)
                    entries = entries.slice(0, remaining);
            }
            datas.push(...entries);
            if (limit !== -1 && datas.length >= limit)
                return datas;
        }
    }
    if (!needsAllData)
        return datas;
    if (min || max || avg || groupBy || count) {
        const groups = new Map();
        const groupKeys = Array.isArray(groupBy) ? groupBy : groupBy ? [groupBy] : [];
        if (groupKeys.length) {
            for (const data of datas) {
                const key = groupKeys.map(k => String(data[k] ?? "")).join("|");
                if (!groups.has(key))
                    groups.set(key, []);
                groups.get(key).push(data);
            }
        }
        else {
            groups.set("all", [...datas]);
        }
        const aggregated = [];
        for (const [, groupItems] of groups) {
            const result = {};
            if (groupKeys.length) {
                const sample = groupItems[0];
                for (const k of groupKeys)
                    result[k] = sample[k];
            }
            if (count) {
                for (const [outKey, srcKey] of Object.entries(count)) {
                    result[outKey] = groupItems.filter(d => d[srcKey] !== undefined && d[srcKey] !== null).length;
                }
            }
            for (const [outKey, srcField] of Object.entries(min ?? {})) {
                const nums = groupItems.map(d => Number(d[srcField])).filter(n => !isNaN(n));
                result[outKey] = nums.length ? Math.min(...nums) : null;
            }
            for (const [outKey, srcField] of Object.entries(max ?? {})) {
                const nums = groupItems.map(d => Number(d[srcField])).filter(n => !isNaN(n));
                result[outKey] = nums.length ? Math.max(...nums) : null;
            }
            for (const [outKey, srcField] of Object.entries(avg ?? {})) {
                const nums = groupItems.map(d => Number(d[srcField])).filter(n => !isNaN(n));
                result[outKey] = nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null;
            }
            aggregated.push(result);
        }
        datas = aggregated;
    }
    if (sortBy) {
        if (sortBy === "random()") {
            datas.sort(() => Math.random() - 0.5);
        }
        else {
            const dir = sortAsc ? 1 : -1;
            datas.sort((a, b) => compareSafe(a[sortBy], b[sortBy]) * dir);
        }
    }
    if (offset > 0 || limit !== -1) {
        const start = offset;
        const end = limit !== -1 ? offset + limit : undefined;
        datas = datas.slice(start, end);
    }
    return datas;
}
