import { ActionsBase } from "../base/actions.js";
import * as Query from "../types/query.js";
export type MatchRule = string | RegExp | ((config: Query.VQuery) => boolean);
export interface RouteEntry {
    match: MatchRule;
    backends: ActionsBase[];
}
export declare class RoutedStorage extends ActionsBase {
    rules: RouteEntry[];
    defaultBackend: ActionsBase[];
    constructor(rules: RouteEntry[], defaultBackend: ActionsBase | ActionsBase[]);
    _matchBackends(config: Query.VQuery): ActionsBase[];
    _withAll<T>(config: Query.VQuery | string, fn: (b: ActionsBase) => Promise<T>, gather?: boolean): Promise<T>;
    _withFirst<T>(config: Query.VQuery | string, fn: (b: ActionsBase) => Promise<T>): Promise<T>;
    init(...args: any[]): Promise<void>;
    add(config: Query.AddQuery): Promise<import("../types/data.js").DataInternal>;
    find(config: Query.FindQuery): Promise<import("../types/data.js").DataInternal[]>;
    findOne(config: Query.FindOneQuery): Promise<import("../types/data.js").DataInternal>;
    update(config: Query.UpdateQuery): Promise<import("../types/data.js").DataInternal[]>;
    updateOne(config: Query.UpdateQuery): Promise<import("../types/data.js").DataInternal>;
    remove(config: Query.RemoveQuery): Promise<import("../types/data.js").DataInternal[]>;
    removeOne(config: Query.RemoveQuery): Promise<import("../types/data.js").DataInternal>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    removeCollection(collection: string): Promise<boolean>;
    getCollections(): Promise<string[]>;
}
