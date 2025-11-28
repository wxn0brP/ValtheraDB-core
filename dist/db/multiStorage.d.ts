import ActionsBase from "../base/actions";
import { VQuery } from "../types/query";
export declare class MultiBackend extends ActionsBase {
    backends: ActionsBase[];
    primaryBackend: ActionsBase;
    constructor(backends: ActionsBase[], primaryIndex?: number);
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
