import { CustomFileCpu } from "../customFileCpu.js";
import { Data } from "../types/data.js";
import { VQueryT } from "../types/query.js";
import { ActionsBase } from "./actions.js";
export declare abstract class CustomActionsBase extends ActionsBase {
    fileCpu: CustomFileCpu;
    constructor();
    /**
     * Add a new entry to the specified database.
     */
    add(query: VQueryT.Add): Promise<import("../types/arg.js").Arg<Data>>;
    /**
     * Find entries in the specified database based on search criteria.
     */
    find(query: VQueryT.Find): Promise<Data[]>;
    /**
     * Find the first matching entry in the specified database based on search criteria.
     */
    findOne(query: VQueryT.FindOne): Promise<Data>;
    /**
     * Update entries in the specified database based on search criteria and an updater function or object.
     */
    update(query: VQueryT.Update): Promise<Data[]>;
    /**
     * Update the first matching entry in the specified database based on search criteria and an updater function or object.
     */
    updateOne(query: VQueryT.Update): Promise<Data>;
    /**
     * Remove entries from the specified database based on search criteria.
     */
    remove(query: VQueryT.Remove): Promise<Data[]>;
    /**
     * Remove the first matching entry from the specified database based on search criteria.
     */
    removeOne(query: VQueryT.Remove): Promise<Data>;
}
