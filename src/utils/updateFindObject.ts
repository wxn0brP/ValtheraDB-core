import { FindOpts } from "../types/options";

type Path = string | string[];

function resolvePath(path: Path): string[] {
    return Array.isArray(path) ? path : path.split(".");
}

function pathExists(obj: any, path: Path): boolean {
    const segs = resolvePath(path);
    if (segs.length === 0) return false;
    let cur = obj;
    for (const s of segs) {
        if (cur == null || typeof cur !== "object" || !(s in cur)) return false;
        cur = cur[s];
    }
    return true;
}

function getValueAt(obj: any, path: Path): any {
    const segs = resolvePath(path);
    let cur = obj;
    for (const s of segs) {
        if (cur == null || typeof cur !== "object") return undefined;
        cur = cur[s];
    }
    return cur;
}

function setNested(obj: any, path: Path, value: any): void {
    const segs = resolvePath(path);
    let cur = obj;
    for (let i = 0; i < segs.length - 1; i++) {
        const s = segs[i];
        if (!(s in cur) || typeof cur[s] !== "object" || Array.isArray(cur[s])) {
            cur[s] = {};
        }
        cur = cur[s];
    }
    cur[segs[segs.length - 1]] = value;
}

function deleteNested(obj: any, path: Path): void {
    const segs = resolvePath(path);
    if (segs.length === 0) return;
    let cur = obj;
    for (let i = 0; i < segs.length - 1; i++) {
        if (cur == null || typeof cur !== "object") return;
        cur = cur[segs[i]];
    }
    if (cur != null && typeof cur === "object") {
        delete cur[segs[segs.length - 1]];
    }
}

/**
 * Updates an object with new values from a findOpts object.
 * @param obj - The object to update.
 * @param findOpts - An object containing options to update the target object.
 * @param [findOpts.transform] - A function to transform the object before applying the other options.
 * @param [findOpts.select] - An array of fields to select from the target object. Supports dotted paths ("a.b.c") and array paths (["a","b","c"]).
 * @param [findOpts.exclude] - An array of fields to exclude from the target object. Supports dotted paths and array paths.
 * @returns The updated object.
 */
export function updateFindObject(obj: Object, findOpts: FindOpts) {
    const {
        transform,
        select,
        exclude,
    } = findOpts;

    if (typeof transform === "function") obj = transform(obj);

    if (Array.isArray(exclude)) {
        for (const field of exclude) {
            if (typeof field === "string" || Array.isArray(field)) {
                deleteNested(obj, field);
            }
        }
    }

    if (Array.isArray(select)) {
        const result: any = {};
        for (const field of select) {
            if ((typeof field === "string" || Array.isArray(field)) && pathExists(obj, field)) {
                setNested(result, field, getValueAt(obj, field));
            }
        }
        obj = result;
    }

    return obj;
}
