import { ActionsBase } from "../base/actions";
import { VQuery } from "../types/query";
export declare class MultiBackend extends ActionsBase {
    backends: ActionsBase[];
    primaryBackend: ActionsBase;
    constructor(backends: ActionsBase[], primaryIndex?: number);
    init(...args: any[]): Promise<void>;
    add(config: VQuery): Promise<import("../types/data").DataInternal>;
    find(config: VQuery): Promise<import("../types/data").DataInternal[]>;
    findOne(config: VQuery): Promise<import("../types/data").DataInternal>;
    update(config: VQuery): Promise<import("../types/data").DataInternal[]>;
    updateOne(config: VQuery): Promise<import("../types/data").DataInternal>;
    remove(config: VQuery): Promise<import("../types/data").DataInternal[]>;
    removeOne(config: VQuery): Promise<import("../types/data").DataInternal>;
    ensureCollection(config: VQuery): Promise<boolean>;
    issetCollection(config: VQuery): Promise<boolean>;
    removeCollection(config: VQuery): Promise<boolean>;
    getCollections(): Promise<string[]>;
}
