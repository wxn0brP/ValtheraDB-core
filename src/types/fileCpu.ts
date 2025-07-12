import { Search, Updater } from "./arg";
import Data from "./data";
import { FindOpts } from "./options";
import { VContext } from "./types";

interface FileCpu {
    /**
     * Asynchronously adds an entry to a file.
     * @param file The path to the file.
     * @param data The data to add.
     * @returns A promise resolving to `void`.
     */
    add(file: string, data: Data): Promise<void>;

    /**
     * Asynchronously finds multiple entries in a file based on search criteria.
     * @param file The path to the file.
     * @param arg The search criteria.
     * @param context Additional context for the search.
     * @param findOpts Additional options for searching.
     * @returns A promise resolving to an array of found entries, or `false` if the file does not exist.
     */
    find(
        file: string,
        arg: Search,
        context?: VContext,
        findOpts?: FindOpts
    ): Promise<any[] | false>;

    /**
     * Asynchronously finds one entry in a file based on search criteria.
     * @param file The path to the file.
     * @param arg The search criteria.
     * @param context Additional context for the search.
     * @param findOpts Additional options for searching.
     * @returns A promise resolving to the found entry or `false` if not found.
     */
    findOne(
        file: string,
        arg: Search,
        context?: VContext,
        findOpts?: FindOpts
    ): Promise<any | false>;

    /**
   * Asynchronously removes entries from a file based on search criteria.
   * @param file The path to the file.
   * @param arg The search criteria.
   * @param context Additional context for the operation.
   * @param one If `true`, removes only the first matching entry.
   * @returns A promise resolving to `true` if at least one entry was removed, otherwise `false`.
   */
    remove(
        file: string,
        one: boolean,
        arg: Search,
        context?: VContext
    ): Promise<boolean>;

    /**
     * Asynchronously updates entries in a file based on search criteria and an updater function or object.
     * @param file The path to the file.
     * @param arg The search criteria.
     * @param updater The updater function or object.
     * @param context Additional context for the operation.
     * @param one If `true`, updates only the first matching entry.
     * @returns A promise resolving to `true` if at least one entry was updated, otherwise `false`.
     */
    update(
        file: string,
        one: boolean,
        arg: Search,
        updater: Updater,
        context?: VContext,
    ): Promise<boolean>;
}

export default FileCpu;