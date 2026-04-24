import { ActionsBase } from "../base/actions";
import { VQueryT, VQuery } from "../types/query";
export type MatchRule = string | RegExp | ((config: VQuery) => boolean);
export interface RouteEntry {
    match: MatchRule;
    backends: ActionsBase[];
}
export declare class RoutedStorage extends ActionsBase {
    rules: RouteEntry[];
    defaultBackend: ActionsBase[];
    constructor(rules: RouteEntry[], defaultBackend: ActionsBase | ActionsBase[]);
    _matchBackends(config: VQuery): ActionsBase[];
    _withAll<T>(config: VQuery | string, fn: (b: ActionsBase) => Promise<T>, gather?: boolean): Promise<T>;
    _withFirst<T>(config: VQuery | string, fn: (b: ActionsBase) => Promise<T>): Promise<T>;
    init(...args: any[]): Promise<void>;
    add(config: VQueryT.Add): Promise<import("../types/data").DataInternal>;
    find(config: VQueryT.Find): Promise<import("../types/data").DataInternal[]>;
    findOne(config: VQueryT.FindOne): Promise<import("../types/data").DataInternal>;
    update(config: VQueryT.Update): Promise<import("../types/data").DataInternal[]>;
    updateOne(config: VQueryT.Update): Promise<import("../types/data").DataInternal>;
    remove(config: VQueryT.Remove): Promise<import("../types/data").DataInternal[]>;
    removeOne(config: VQueryT.Remove): Promise<import("../types/data").DataInternal>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    removeCollection(collection: string): Promise<boolean>;
    getCollections(): Promise<string[]>;
}
