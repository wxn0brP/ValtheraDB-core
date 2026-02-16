import { ActionsBase } from "../base/actions.js";
import { VQuery } from "../types/query.js";
export type MatchRule = string | RegExp | ((query: VQuery) => boolean);
export interface RouteEntry {
    match: MatchRule;
    backends: ActionsBase[];
}
export declare class RoutedStorage extends ActionsBase {
    rules: RouteEntry[];
    defaultBackend: ActionsBase[];
    constructor(rules: RouteEntry[], defaultBackend: ActionsBase | ActionsBase[]);
    _matchBackends(config: VQuery): ActionsBase[];
    _withAll<T>(config: VQuery, fn: (b: ActionsBase) => Promise<T>, gather?: boolean): Promise<T>;
    _withFirst<T>(config: VQuery, fn: (b: ActionsBase) => Promise<T>): Promise<T>;
    init(...args: any[]): Promise<void>;
    add(config: VQuery): Promise<import("../types/data.js").DataInternal>;
    find(config: VQuery): Promise<import("../types/data.js").DataInternal[]>;
    findOne(config: VQuery): Promise<import("../types/data.js").DataInternal>;
    update(config: VQuery): Promise<import("../types/data.js").DataInternal[]>;
    updateOne(config: VQuery): Promise<import("../types/data.js").DataInternal>;
    remove(config: VQuery): Promise<import("../types/data.js").DataInternal[]>;
    removeOne(config: VQuery): Promise<import("../types/data.js").DataInternal>;
    ensureCollection(config: VQuery): Promise<boolean>;
    issetCollection(config: VQuery): Promise<boolean>;
    removeCollection(config: VQuery): Promise<boolean>;
    getCollections(): Promise<string[]>;
}
