import { ActionsBase } from "../base/actions.js";
import { VQueryT } from "../types/query.js";
export declare class MultiBackend extends ActionsBase {
    backends: ActionsBase[];
    primaryBackend: ActionsBase;
    constructor(backends: ActionsBase[], primaryIndex?: number);
    init(...args: any[]): Promise<void>;
    add(config: VQueryT.Add): Promise<import("../types/data.js").DataInternal>;
    find(config: VQueryT.Find): Promise<import("../types/data.js").DataInternal[]>;
    findOne(config: VQueryT.FindOne): Promise<import("../types/data.js").DataInternal>;
    update(config: VQueryT.Update): Promise<import("../types/data.js").DataInternal[]>;
    updateOne(config: VQueryT.Update): Promise<import("../types/data.js").DataInternal>;
    remove(config: VQueryT.Remove): Promise<import("../types/data.js").DataInternal[]>;
    removeOne(config: VQueryT.Remove): Promise<import("../types/data.js").DataInternal>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    removeCollection(collection: string): Promise<boolean>;
    getCollections(): Promise<string[]>;
}
