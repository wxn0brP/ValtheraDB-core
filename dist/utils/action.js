import { compareSafe } from "./compare.js";
import { isUnsafeKey } from "./security.js";
function getOwnValue(obj, key) {
    return Object.hasOwn(obj, key) ? obj[key] : undefined;
}
export async function findUtil(query, fileCpuOrData, files, fileCpuOpts) {
    const { dbFindOpts = {} } = query;
    const { reverse = false, offset = 0, sortBy, sortAsc = true, min, max, avg, sum, distinct, groupBy, count, } = dbFindOpts;
    let limit = dbFindOpts.limit ?? -1;
    if (limit === Infinity)
        limit = -1;
    const needsAllData = min || max || avg || sum || distinct || groupBy || count || sortBy;
    let datas = [];
    let skippedEntries = 0;
    if (Array.isArray(fileCpuOrData)) {
        const src = fileCpuOrData;
        const len = src.length;
        if (reverse && !sortBy) {
            datas = new Array(len);
            for (let i = 0; i < len; i++)
                datas[i] = src[len - 1 - i];
        }
        else {
            datas = src.slice();
        }
        if (!needsAllData) {
            if (offset > 0 || limit !== -1) {
                const start = offset;
                const end = limit !== -1 ? offset + limit : undefined;
                datas = datas.slice(start, end);
            }
        }
    }
    else {
        const filesToProcess = reverse && !sortBy
            ? [
                ...files,
            ].reverse()
            : files;
        for (const f of filesToProcess) {
            let entries = (await fileCpuOrData.find(f, query, fileCpuOpts));
            if (reverse && !sortBy)
                entries.reverse();
            if (needsAllData) {
                for (let i = 0; i < entries.length; i++)
                    datas.push(entries[i]);
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
            for (let i = 0; i < entries.length; i++)
                datas.push(entries[i]);
            if (limit !== -1 && datas.length >= limit)
                return datas;
        }
    }
    if (!needsAllData)
        return datas;
    if (datas.length === 0)
        return [];
    const hasAggregations = min || max || avg || sum || groupBy || count;
    if (hasAggregations) {
        const groups = new Map();
        const groupKeys = (Array.isArray(groupBy)
            ? groupBy
            : groupBy
                ? [
                    groupBy,
                ]
                : []).filter(key => !isUnsafeKey(key));
        if (groupKeys.length) {
            for (const data of datas) {
                let key = String(getOwnValue(data, groupKeys[0]) ?? "");
                for (let i = 1; i < groupKeys.length; i++) {
                    key += "|" + String(getOwnValue(data, groupKeys[i]) ?? "");
                }
                let group = groups.get(key);
                if (!group) {
                    group = [];
                    groups.set(key, group);
                }
                group.push(data);
            }
        }
        else {
            groups.set("all", datas.slice());
        }
        const aggregated = [];
        for (const [, groupItems] of groups) {
            const result = {};
            if (groupKeys.length) {
                const sample = groupItems[0];
                for (const k of groupKeys) {
                    if (Object.hasOwn(sample, k))
                        result[k] = sample[k];
                }
            }
            if (count) {
                for (const [outKey, srcKey] of Object.entries(count)) {
                    if (isUnsafeKey(outKey))
                        continue;
                    let c = 0;
                    for (let i = 0; i < groupItems.length; i++) {
                        const v = getOwnValue(groupItems[i], srcKey);
                        if (v !== undefined && v !== null)
                            c++;
                    }
                    result[outKey] = c;
                }
            }
            const minEntries = min ? Object.entries(min) : null;
            const maxEntries = max ? Object.entries(max) : null;
            const avgEntries = avg ? Object.entries(avg) : null;
            const sumEntries = sum ? Object.entries(sum) : null;
            if (minEntries) {
                for (const [outKey, srcField] of minEntries) {
                    if (isUnsafeKey(outKey))
                        continue;
                    let best = null;
                    for (let i = 0; i < groupItems.length; i++) {
                        const v = getOwnValue(groupItems[i], srcField);
                        if (typeof v === "number") {
                            if (best === null || v < best)
                                best = v;
                        }
                    }
                    result[outKey] = best;
                }
            }
            if (maxEntries) {
                for (const [outKey, srcField] of maxEntries) {
                    if (isUnsafeKey(outKey))
                        continue;
                    let best = null;
                    for (let i = 0; i < groupItems.length; i++) {
                        const v = getOwnValue(groupItems[i], srcField);
                        if (typeof v === "number") {
                            if (best === null || v > best)
                                best = v;
                        }
                    }
                    result[outKey] = best;
                }
            }
            if (avgEntries) {
                for (const [outKey, srcField] of avgEntries) {
                    if (isUnsafeKey(outKey))
                        continue;
                    let total = 0;
                    let c = 0;
                    for (let i = 0; i < groupItems.length; i++) {
                        const v = getOwnValue(groupItems[i], srcField);
                        if (typeof v === "number") {
                            total += v;
                            c++;
                        }
                    }
                    result[outKey] = c > 0 ? total / c : null;
                }
            }
            if (sumEntries) {
                for (const [outKey, srcField] of sumEntries) {
                    if (isUnsafeKey(outKey))
                        continue;
                    let total = 0;
                    let c = 0;
                    for (let i = 0; i < groupItems.length; i++) {
                        const v = getOwnValue(groupItems[i], srcField);
                        if (typeof v === "number") {
                            total += v;
                            c++;
                        }
                    }
                    result[outKey] = c > 0 ? total : null;
                }
            }
            aggregated.push(result);
        }
        datas = aggregated;
    }
    if (distinct && !isUnsafeKey(distinct)) {
        const seen = new Set();
        const result = [];
        for (let i = 0; i < datas.length; i++) {
            const val = getOwnValue(datas[i], distinct);
            const key = typeof val === "object" && val !== null ? JSON.stringify(val) : val;
            if (!seen.has(key)) {
                seen.add(key);
                result.push(datas[i]);
            }
        }
        datas = result;
    }
    if (sortBy) {
        if (sortBy === "random()") {
            datas.sort(() => Math.random() - 0.5);
        }
        else if (Array.isArray(sortBy)) {
            datas.sort((a, b) => {
                for (const { field, asc = true } of sortBy) {
                    const dir = asc ? 1 : -1;
                    const cmp = compareSafe(getOwnValue(a, field), getOwnValue(b, field)) * dir;
                    if (cmp !== 0)
                        return cmp;
                }
                return 0;
            });
        }
        else {
            const dir = sortAsc ? 1 : -1;
            datas.sort((a, b) => compareSafe(getOwnValue(a, sortBy), getOwnValue(b, sortBy)) * dir);
        }
    }
    if (offset > 0 || limit !== -1) {
        const start = offset;
        const end = limit !== -1 ? offset + limit : undefined;
        datas = datas.slice(start, end);
    }
    return datas;
}
