import { ActionsBase } from "../base/actions.js";
import { VQuery } from "../types/query.js";
export declare class MultiBackend extends ActionsBase {
    backends: ActionsBase[];
    primaryBackend: ActionsBase;
    constructor(backends: ActionsBase[], primaryIndex?: number);
    init(...args: any[]): Promise<void>;
    add(config: VQuery): Promise<import("../types/data.js").Data>;
    find(config: VQuery): Promise<import("../types/data.js").Data[]>;
    findOne(config: VQuery): Promise<import("../types/data.js").Data>;
    update(config: VQuery): Promise<import("../types/data.js").Data[]>;
    updateOne(config: VQuery): Promise<import("../types/data.js").Data>;
    remove(config: VQuery): Promise<import("../types/data.js").Data[]>;
    removeOne(config: VQuery): Promise<import("../types/data.js").Data>;
    ensureCollection(config: VQuery): Promise<boolean>;
    issetCollection(config: VQuery): Promise<boolean>;
    removeCollection(config: VQuery): Promise<boolean>;
    getCollections(): Promise<string[]>;
}
