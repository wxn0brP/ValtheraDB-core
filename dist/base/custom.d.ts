import { CustomFileCpu } from "../customFileCpu.js";
import { Data } from "../types/data.js";
import { VQuery } from "../types/query.js";
import { ActionsBase } from "./actions.js";
export declare class CustomActionsBase extends ActionsBase {
    fileCpu: CustomFileCpu;
    constructor();
    /**
     * Add a new entry to the specified database.
     */
    add(query: VQuery): Promise<import("../types/arg.js").Arg>;
    /**
     * Find entries in the specified database based on search criteria.
     */
    find(query: VQuery): Promise<Data[]>;
    /**
     * Find the first matching entry in the specified database based on search criteria.
     */
    findOne({ collection, search, context, findOpts }: VQuery): Promise<Data>;
    /**
     * Update entries in the specified database based on search criteria and an updater function or object.
     */
    update({ collection, search, updater, context }: VQuery): Promise<Data[]>;
    /**
     * Update the first matching entry in the specified database based on search criteria and an updater function or object.
     */
    updateOne({ collection, search, updater, context }: VQuery): Promise<Data>;
    /**
     * Remove entries from the specified database based on search criteria.
     */
    remove({ collection, search, context }: VQuery): Promise<Data[]>;
    /**
     * Remove the first matching entry from the specified database based on search criteria.
     */
    removeOne({ collection, search, context }: VQuery): Promise<Data>;
}
