export function pickByPath(obj, paths) {
    const result = {};
    for (const path of paths) {
        let src = obj;
        let dst = result;
        for (let i = 0; i < path.length; i++) {
            const k = path[i];
            if (src == null)
                break;
            if (i === path.length - 1) {
                dst[k] = src[k];
            }
            else {
                dst[k] ||= {};
                dst = dst[k];
                src = src[k];
            }
        }
    }
    return result;
}
export function autoSelect(rel, key) {
    const select = Array.isArray(rel.select) ? [...rel.select] : undefined;
    const shouldDelete = select && !select.includes(key);
    if (shouldDelete)
        select.push(key);
    return [select, shouldDelete];
}
export function convertSearchObjToSearchArray(obj, parentKeys = []) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const currentPath = [...parentKeys, key];
        if (!value) {
            return acc;
        }
        else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            return [...acc, ...convertSearchObjToSearchArray(value, currentPath)];
        }
        else {
            return [...acc, currentPath];
        }
    }, []);
}
export async function processRelations(dbs, cfg, data, parentList = null) {
    if (!data && !parentList)
        return;
    const batchMode = Array.isArray(parentList);
    const targets = batchMode ? parentList : [data];
    for (const key in cfg) {
        if (!cfg.hasOwnProperty(key))
            continue;
        const rel = cfg[key];
        const { pk = "_id", fk = "_id", type = "1", path, as = key, select, dbFindOpts = {}, through } = rel;
        const [dbKey, collection] = path;
        const db = dbs[dbKey];
        if (type === "1") {
            const keys = [...new Set(targets.map(i => i[pk]))];
            const [selectSafe, deleteSelect] = autoSelect(rel, fk);
            const results = await db.find({
                collection,
                search: { $in: { [fk]: keys } },
                findOpts: { select: selectSafe }
            });
            const map = new Map(results.map(row => [row[fk], row]));
            for (const item of targets) {
                const result = map.get(item[pk]) || null;
                if (result && rel.relations)
                    await processRelations(dbs, rel.relations, result);
                if (deleteSelect && result)
                    delete result[fk];
                item[as] = result;
            }
        }
        else if (type === "11") {
            const cache = new Map();
            const [selectSafe, deleteSelect] = autoSelect(rel, fk);
            for (const item of targets) {
                const id = item[pk];
                if (!cache.has(id))
                    cache.set(id, await db.findOne({
                        collection,
                        search: { [fk]: id },
                        findOpts: { select: selectSafe }
                    }));
                const result = cache.get(id) || null;
                if (result && rel.relations)
                    await processRelations(dbs, rel.relations, result);
                if (deleteSelect && result)
                    delete result[fk];
                item[as] = result;
            }
        }
        else if (type === "1n") {
            const ids = targets.map(i => i[pk]);
            const [selectSafe, deleteSelect] = autoSelect(rel, fk);
            const results = await db.find({
                collection,
                search: { $in: { [fk]: ids } },
                dbFindOpts,
                findOpts: { select: selectSafe }
            });
            const grouped = results.reduce((acc, row) => {
                const id = row[fk];
                (acc[id] ||= []).push(row);
                return acc;
            }, {});
            for (const item of targets)
                item[as] = grouped[item[pk]] || [];
            if (rel.relations)
                await Promise.all(results.map(row => processRelations(dbs, rel.relations, row)));
            if (deleteSelect)
                for (const r of results)
                    delete r[fk];
        }
        else if (type === "nm") {
            if (!through || !through.table || !through.pk || !through.fk)
                throw new Error(`Relation type "nm" requires a defined "through" in "${key}"`);
            for (const item of targets) {
                const pivotDb = dbs[through.db || dbKey];
                const pivots = await pivotDb.find({
                    collection: through.table,
                    search: { [through.pk]: item[pk] }
                });
                const ids = pivots.map(p => p[through.fk]);
                const related = await db.find({
                    collection,
                    search: { $in: { [fk]: ids } },
                    findOpts: { select }
                });
                item[as] = related;
                if (rel.relations) {
                    await Promise.all(related.map(row => processRelations(dbs, rel.relations, row)));
                }
            }
        }
        else {
            throw new Error(`Unknown relation type: ${type}`);
        }
    }
}
export class Relation {
    dbs;
    constructor(dbs) {
        this.dbs = dbs;
    }
    async findOne(path, search, relations, select) {
        const [dbKey, collection] = path;
        const db = this.dbs[dbKey];
        const data = await db.findOne({ collection, search });
        if (!data)
            return null;
        if (typeof select === "object" && !Array.isArray(select))
            select = convertSearchObjToSearchArray(select);
        await processRelations(this.dbs, relations, data);
        return select ? pickByPath(data, select) : data;
    }
    async find(path, search, relations, select, dbFindOpts = {}) {
        const [dbKey, collection] = path;
        const db = this.dbs[dbKey];
        const data = await db.find({ collection, search, dbFindOpts });
        if (relations)
            await processRelations(this.dbs, relations, null, data);
        if (typeof select === "object" && !Array.isArray(select))
            select = convertSearchObjToSearchArray(select);
        return select ? data.map(d => pickByPath(d, select)) : data;
    }
}
