export declare function convertIdToUnix(id: string): number;
export declare function sortByIds<T extends {
    _id: string;
}>(objects: T[]): T[];
