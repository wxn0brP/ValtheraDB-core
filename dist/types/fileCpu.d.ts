import { DataInternal } from "./data.js";
import * as Query from "./query.js";
export interface FileCpu {
    /**
     * Asynchronously adds an entry to a file.
     * @returns A promise resolving to `void`.
     */
    add(config: Query.AddQuery): Promise<void>;
    /**
     * Asynchronously finds multiple entries in a file based on search criteria.
     * @returns A promise resolving to an array of found entries, or `false` if the file does not exist.
     */
    find(config: Query.FindQuery): Promise<DataInternal[]>;
    /**
     * Asynchronously finds one entry in a file based on search criteria.
     * @returns A promise resolving to the found entry or `false` if not found.
     */
    findOne(config: Query.FindOneQuery): Promise<DataInternal | false>;
    /**
   * Asynchronously removes entries from a file based on search criteria.
   * @param one If `true`, removes only the first matching entry.
   * @returns A promise resolving to `true` if at least one entry was removed, otherwise `false`.
   */
    remove(config: Query.RemoveQuery, one: boolean): Promise<DataInternal[]>;
    /**
     * Asynchronously updates entries in a file based on search criteria and an updater function or object.
     * @param one If `true`, updates only the first matching entry.
     * @returns A promise resolving to `true` if at least one entry was updated, otherwise `false`.
     */
    update(config: Query.UpdateQuery, one: boolean): Promise<DataInternal[]>;
}
