import { VQuery } from "../types/query";

export function assignDataPush(data: any) {
    if (!data) return {};
    if (typeof data !== "object" || Array.isArray(data)) return {};
    if (Object.keys(data).length === 0) return {};

    const obj = {};

    for (const key of Object.keys(data)) {
        if (!key.startsWith("$")) {
            obj[key] = data[key];
            continue;
        }

        const dk = data[key];
        if (Array.isArray(dk)) continue;
        Object.keys(dk).forEach((k) => obj[k] = dk[k]);
    }

    return obj;
}

export function setDataForUpdateOneOrAdd(query: VQuery) {
    query.data = Object.assign(
        {},
        assignDataPush(query.search),
        assignDataPush(query.updater),
        assignDataPush(query.add_arg)
    );
}

export function setDataForToggleOne(query: VQuery) {
    query.data = Object.assign(
        {},
        assignDataPush(query.search),
        assignDataPush(query.data)
    );
}