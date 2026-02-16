import { ActionsBase } from "../base/actions.js";
import { VQuery } from "../types/query.js";
export declare class MultiBackend extends ActionsBase {
    backends: ActionsBase[];
    primaryBackend: ActionsBase;
    constructor(backends: ActionsBase[], primaryIndex?: number);
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
