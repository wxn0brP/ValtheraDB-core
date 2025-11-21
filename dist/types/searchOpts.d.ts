import { Arg } from "./arg";
import { PartialOfType, PartialPickMatching } from "./utils";
export type LogicalOperators<T = any> = {
    $and?: Array<SearchOptions<T>>;
    $or?: Array<SearchOptions<T>>;
    $not?: SearchOptions<T>;
};
export type ComparisonOperators<T = any> = {
    $gt?: PartialOfType<T, number>;
    $lt?: PartialOfType<T, number>;
    $gte?: PartialOfType<T, number>;
    $lte?: PartialOfType<T, number>;
    $between?: PartialOfType<T, [number, number], number>;
    $in?: Partial<Record<keyof T, T[keyof T][]>>;
    $nin?: Partial<Record<keyof T, T[keyof T][]>>;
    $idGt?: PartialOfType<T, string | number>;
    $idLt?: PartialOfType<T, string | number>;
    $idGte?: PartialOfType<T, string | number>;
    $idLte?: PartialOfType<T, string | number>;
};
export type TypeAndExistenceOperators<T = any> = {
    $exists?: PartialOfType<T, boolean, any>;
    $type?: PartialOfType<T, string>;
};
export type ArrayOperators<T = any> = {
    $arrinc?: PartialPickMatching<T, any[]>;
    $arrincall?: PartialPickMatching<T, any[]>;
    $size?: PartialOfType<T, number>;
};
export type StringOperators<T = any> = {
    $regex?: PartialOfType<T, RegExp | string, string>;
    $startsWith?: PartialOfType<T, string>;
    $endsWith?: PartialOfType<T, string>;
};
export type OtherOperators<T = any> = {
    $subset?: Partial<Record<keyof T, T[keyof T]>>;
};
export type PredefinedSearchOperators<T = any> = LogicalOperators<T> & ComparisonOperators<T> & TypeAndExistenceOperators<T> & ArrayOperators<T> & StringOperators<T> & OtherOperators<T>;
export type SearchOptions<T = any> = PredefinedSearchOperators<T> & Arg<T>;
