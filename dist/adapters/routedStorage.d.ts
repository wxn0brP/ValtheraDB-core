import { AdapterBase } from "../base/adapter.js";
import { VQueryT, VQuery } from "../types/query.js";
import { TransactionHandle } from "../types/transaction.js";
export type MatchRule = string | RegExp | ((config: VQuery) => boolean);
export interface RouteEntry {
    match: MatchRule;
    backends: AdapterBase[];
}
export declare class RoutedStorage extends AdapterBase {
    rules: RouteEntry[];
    defaultBackend: AdapterBase[];
    constructor(rules: RouteEntry[], defaultBackend: AdapterBase | AdapterBase[]);
    _matchBackends(config: VQuery): AdapterBase[];
    _withAll<T>(config: VQuery | string, fn: (b: AdapterBase) => Promise<T>, gather?: boolean): Promise<T>;
    _withFirst<T>(config: VQuery | string, fn: (b: AdapterBase) => Promise<T>): Promise<T>;
    init(...args: any[]): Promise<void>;
    close(...args: any[]): Promise<void>;
    add(config: VQueryT.Add): Promise<import("../types/data.js").DataInternal>;
    find(config: VQueryT.Find): Promise<import("../types/data.js").DataInternal[]>;
    findOne(config: VQueryT.FindOne): Promise<import("../types/data.js").DataInternal | null>;
    update(config: VQueryT.Update): Promise<import("../types/data.js").DataInternal[]>;
    updateOne(config: VQueryT.Update): Promise<import("../types/data.js").DataInternal | null>;
    remove(config: VQueryT.Remove): Promise<import("../types/data.js").DataInternal[]>;
    removeOne(config: VQueryT.Remove): Promise<import("../types/data.js").DataInternal | null>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    removeCollection(collection: string): Promise<boolean>;
    getCollections(): Promise<string[]>;
    beginTransaction(): Promise<TransactionHandle>;
    commitTransaction(): Promise<void>;
    rollbackTransaction(): Promise<void>;
}
