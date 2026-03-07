import { ActionsBase } from "../base/actions.js";
import * as Query from "../types/query.js";
export declare class MultiBackend extends ActionsBase {
    backends: ActionsBase[];
    primaryBackend: ActionsBase;
    constructor(backends: ActionsBase[], primaryIndex?: number);
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
