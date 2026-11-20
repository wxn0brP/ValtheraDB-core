export declare function convertIdToUnix(id: string): number;
/**
 * Sorts an array of objects by their _id property
 */
export declare function sortByIds<T extends {
    _id: string;
}>(objects: T[]): T[];
export declare function sortByIds<T extends Record<string, any>>(objects: T[], key: string): T[];
/**
 * Sorts an array of objects using reference
 * @param objects
 * @param key default "_id"
 */
export declare function sortByIdsRef(objects: Record<string, any>[], key?: string): void;
export declare function compareIds(a: string | number, b: string | number): number;
