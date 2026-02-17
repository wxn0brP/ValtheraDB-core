import { DeepPartial, NestedValue } from "./utils";
export type JSPrimitiveType = "string" | "number" | "boolean" | "bigint" | "symbol" | "undefined" | "function" | "object";
export type LogicalOperators<T = any> = {
    $and?: Array<SearchOptions<T>>;
    $or?: Array<SearchOptions<T>>;
    $not?: SearchOptions<T>;
};
export type ComparisonOperators<T = any> = {
    $gt?: NestedValue<T, number, number>;
    $lt?: NestedValue<T, number, number>;
    $gte?: NestedValue<T, number, number>;
    $lte?: NestedValue<T, number, number>;
    $between?: NestedValue<T, [number, number], number>;
    $in?: DeepPartial<T> & {
        [K in keyof T]?: T[K] extends any[] ? T[K] : T[K][];
    };
    $nin?: DeepPartial<T> & {
        [K in keyof T]?: T[K] extends any[] ? T[K] : T[K][];
    };
    $idGt?: NestedValue<T, string | number, string | number>;
    $idLt?: NestedValue<T, string | number, string | number>;
    $idGte?: NestedValue<T, string | number, string | number>;
    $idLte?: NestedValue<T, string | number, string | number>;
};
export type TypeAndExistenceOperators<T = any> = {
    $exists?: NestedValue<T, boolean, any>;
    $type?: NestedValue<T, JSPrimitiveType, any>;
};
export type ArrayOperators<T = any> = {
    $arrinc?: DeepPartial<T>;
    $arrincall?: DeepPartial<T>;
    $size?: NestedValue<T, number>;
};
export type StringOperators<T = any> = {
    $regex?: NestedValue<T, RegExp | string, string>;
    $startsWith?: NestedValue<T, string, string>;
    $endsWith?: NestedValue<T, string, string>;
};
export type OtherOperators<T = any> = {
    $subset?: DeepPartial<T>;
};
export type PredefinedSearchOperators<T = any> = LogicalOperators<T> & ComparisonOperators<T> & TypeAndExistenceOperators<T> & ArrayOperators<T> & StringOperators<T> & OtherOperators<T>;
export type SearchOptions<T = any> = PredefinedSearchOperators<T> & DeepPartial<T> & Record<string, any>;
