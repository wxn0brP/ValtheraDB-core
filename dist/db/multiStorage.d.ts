import { ActionsBase } from "../base/actions";
import * as Query from "../types/query";
export declare class MultiBackend extends ActionsBase {
    backends: ActionsBase[];
    primaryBackend: ActionsBase;
    constructor(backends: ActionsBase[], primaryIndex?: number);
    init(...args: any[]): Promise<void>;
    add(config: Query.AddQuery): Promise<import("../types/data").DataInternal>;
    find(config: Query.FindQuery): Promise<import("../types/data").DataInternal[]>;
    findOne(config: Query.FindOneQuery): Promise<import("../types/data").DataInternal>;
    update(config: Query.UpdateQuery): Promise<import("../types/data").DataInternal[]>;
    updateOne(config: Query.UpdateQuery): Promise<import("../types/data").DataInternal>;
    remove(config: Query.RemoveQuery): Promise<import("../types/data").DataInternal[]>;
    removeOne(config: Query.RemoveQuery): Promise<import("../types/data").DataInternal>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    removeCollection(collection: string): Promise<boolean>;
    getCollections(): Promise<string[]>;
}
