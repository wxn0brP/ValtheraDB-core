import { DataInternal } from "./data.js";
import { VQueryT } from "./query.js";
export interface FileCpu {
    /**
     * Asynchronously adds an entry to a file.
     * @returns A promise resolving to `void`.
     */
    add(file: string, config: VQueryT.Add): Promise<void>;
    /**
     * Asynchronously finds multiple entries in a file based on search criteria.
     * @returns A promise resolving to an array of found entries, or `false` if the file does not exist.
     */
    find(file: string, config: VQueryT.Find): Promise<DataInternal[]>;
    /**
     * Asynchronously finds one entry in a file based on search criteria.
     * @returns A promise resolving to the found entry or `false` if not found.
     */
    findOne(file: string, config: VQueryT.FindOne): Promise<DataInternal | false>;
    /**
   * Asynchronously removes entries from a file based on search criteria.
   * @param one If `true`, removes only the first matching entry.
   * @returns A promise resolving to `true` if at least one entry was removed, otherwise `false`.
   */
    remove(file: string, config: VQueryT.Remove, one: boolean): Promise<DataInternal[]>;
    /**
     * Asynchronously updates entries in a file based on search criteria and an updater function or object.
     * @param one If `true`, updates only the first matching entry.
     * @returns A promise resolving to `true` if at least one entry was updated, otherwise `false`.
     */
    update(file: string, config: VQueryT.Update, one: boolean): Promise<DataInternal[]>;
}
