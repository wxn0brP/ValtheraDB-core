import { CustomFileCpu } from "../customFileCpu.js";
import { Data } from "../types/data.js";
import * as Query from "../types/query.js";
import { ActionsBase } from "./actions.js";
export declare abstract class CustomActionsBase extends ActionsBase {
    fileCpu: CustomFileCpu;
    constructor();
    /**
     * Add a new entry to the specified database.
     */
    add(query: Query.AddQuery): Promise<import("../types/arg.js").Arg<Data>>;
    /**
     * Find entries in the specified database based on search criteria.
     */
    find(query: Query.FindQuery): Promise<Data[]>;
    /**
     * Find the first matching entry in the specified database based on search criteria.
     */
    findOne(query: Query.FindOneQuery): Promise<Data>;
    /**
     * Update entries in the specified database based on search criteria and an updater function or object.
     */
    update(query: Query.UpdateQuery): Promise<Data[]>;
    /**
     * Update the first matching entry in the specified database based on search criteria and an updater function or object.
     */
    updateOne(query: Query.UpdateQuery): Promise<Data>;
    /**
     * Remove entries from the specified database based on search criteria.
     */
    remove(query: Query.RemoveQuery): Promise<Data[]>;
    /**
     * Remove the first matching entry from the specified database based on search criteria.
     */
    removeOne(query: Query.RemoveQuery): Promise<Data>;
}
