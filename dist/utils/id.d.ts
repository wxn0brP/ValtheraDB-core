export declare function convertIdToUnix(id: string): number;
export declare function sortByIds<T extends {
    _id: string;
}>(objects: T[]): T[];
export declare function compareIds(a: string | number, b: string | number): number;
