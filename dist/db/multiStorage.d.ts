import { ActionsBase } from "../base/actions";
import { VQueryT } from "../types/query";
export declare class MultiBackend extends ActionsBase {
    backends: ActionsBase[];
    primaryBackend: ActionsBase;
    constructor(backends: ActionsBase[], primaryIndex?: number);
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
