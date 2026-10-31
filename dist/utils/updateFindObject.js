import { hasUnsafeSegment } from "./security.js";
function resolvePath(path) {
    return Array.isArray(path) ? path : path.split(".");
}
function deleteNested(obj, path) {
    const segs = resolvePath(path);
    if (segs.length === 0 || hasUnsafeSegment(segs))
        return;
    let cur = obj;
    for (let i = 0; i < segs.length - 1; i++) {
        if (cur == null || typeof cur !== "object")
            return;
        if (!Object.hasOwn(cur, segs[i]))
            return;
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
export function updateFindObject(obj, findOpts) {
    const { transform, select, exclude } = findOpts;
    if (typeof transform === "function")
        obj = transform(obj);
    if (Array.isArray(exclude)) {
        for (const field of exclude) {
            if (typeof field === "string" || Array.isArray(field)) {
                deleteNested(obj, field);
            }
        }
    }
    if (Array.isArray(select)) {
        const result = {};
        for (const field of select) {
            const segs = typeof field === "string" ? field.split(".") : field;
            if (!segs.length || hasUnsafeSegment(segs))
                continue;
            let src = obj;
            let found = true;
            for (let i = 0; i < segs.length; i++) {
                if (src == null ||
                    typeof src !== "object" ||
                    !Object.hasOwn(src, segs[i])) {
                    found = false;
                    break;
                }
                src = src[segs[i]];
            }
            if (found) {
                let dst = result;
                for (let i = 0; i < segs.length - 1; i++) {
                    const s = segs[i];
                    if (!Object.hasOwn(dst, s) ||
                        typeof dst[s] !== "object" ||
                        Array.isArray(dst[s])) {
                        dst[s] = {};
                    }
                    dst = dst[s];
                }
                dst[segs[segs.length - 1]] = src;
            }
        }
        obj = result;
    }
    return obj;
}
