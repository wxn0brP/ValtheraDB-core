import { DeepPartial, NestedValue } from "./utils.js";
/** Logical Operators */
export type LogicalOperators<T = any> = {
    /**
     * Recursively applies multiple conditions, all of which must evaluate to true.
     * Can include other operators such as $gt, $exists, or nested $and/$or conditions.
     */
    $and?: Array<SearchOptions<T>>;
    /**
     * Recursively applies multiple conditions, at least one of which must evaluate to true.
     * Can include other operators such as $lt, $type, or nested $and/$or conditions.
     */
    $or?: Array<SearchOptions<T>>;
    /**
     * Negates a single condition.
     * Can include any other operator as its value.
     */
    $not?: SearchOptions<T>;
};
/** Comparison Operators with nested support */
export type ComparisonOperators<T = any> = {
    /** 5 > 4 */
    $gt?: NestedValue<T, number, number>;
    /** 5 < 4 */
    $lt?: NestedValue<T, number, number>;
    /** 5 >= 4 */
    $gte?: NestedValue<T, number, number>;
    /** 5 <= 4 */
    $lte?: NestedValue<T, number, number>;
    /** 5 between [min, max] */
    $between?: NestedValue<T, [number, number], number>;
    /** 2 in [1, 2, 3] */
    $in?: DeepPartial<T> & {
        [K in keyof T]?: T[K] extends any[] ? T[K] : T[K][];
    };
    /** 5 not in [1, 2, 3] */
    $nin?: DeepPartial<T> & {
        [K in keyof T]?: T[K] extends any[] ? T[K] : T[K][];
    };
    /** id > 4 */
    $idGt?: NestedValue<T, string | number, string | number>;
    /** id < 4 */
    $idLt?: NestedValue<T, string | number, string | number>;
    /** id >= 4 */
    $idGte?: NestedValue<T, string | number, string | number>;
    /** id <= 4 */
    $idLte?: NestedValue<T, string | number, string | number>;
};
/** Type and Existence Operators with nested support */
export type TypeAndExistenceOperators<T = any> = {
    /** "name" in { name: "John" } */
    $exists?: NestedValue<T, boolean>;
    /** "name" == "string" in { name: "John" } */
    $type?: NestedValue<T, string>;
};
/** Array Operators with nested support */
export type ArrayOperators<T = any> = {
    /** [1, 2, 3] includes 2 */
    $arrinc?: DeepPartial<T>;
    /** [1, 2, 3] array includes all elements e.g. [1, 2] */
    $arrincall?: DeepPartial<T>;
    /** [1, 2, 3] has size 3 */
    $size?: NestedValue<T, number>;
};
/** String Operators with nested support */
export type StringOperators<T = any> = {
    /** "John" matches /oh/ */
    $regex?: NestedValue<T, RegExp | string, string>;
    /** "John" starts with "Jo" */
    $startsWith?: NestedValue<T, string, string>;
    /** "John" ends with "hn" */
    $endsWith?: NestedValue<T, string, string>;
};
/** Other Operators with nested support */
export type OtherOperators<T = any> = {
    /** { $type: "name" } matches { $type: "name" } literally - Ignore $ operators */
    $subset?: DeepPartial<T>;
};
/** Predefined Search Operators */
export type PredefinedSearchOperators<T = any> = LogicalOperators<T> & ComparisonOperators<T> & TypeAndExistenceOperators<T> & ArrayOperators<T> & StringOperators<T> & OtherOperators<T>;
/**
 * SearchOptions can be either a function or an object with predefined operators.
 */
export type SearchOptions<T = any> = PredefinedSearchOperators<T> & DeepPartial<T> & Record<string, any>;
