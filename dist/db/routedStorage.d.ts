import ActionsBase from "../base/actions";
import { VQuery } from "../types/query";
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
    add(config: VQuery): Promise<import("../types/data").Data>;
    find(config: VQuery): Promise<import("../types/data").Data[]>;
    findOne(config: VQuery): Promise<import("../types/data").Data>;
    update(config: VQuery): Promise<boolean>;
    updateOne(config: VQuery): Promise<boolean>;
    remove(config: VQuery): Promise<boolean>;
    removeOne(config: VQuery): Promise<boolean>;
    ensureCollection(config: VQuery): Promise<boolean>;
    issetCollection(config: VQuery): Promise<boolean>;
    removeCollection(config: VQuery): Promise<boolean>;
    getCollections(): Promise<string[]>;
}
