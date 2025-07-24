/**
 * Predefined Search Options Quick Reference
 *
 * This module defines the types and structures for search operators used
 * to validate and query data objects.
 */
import { Arg } from "./arg.js";
import { PartialOfType, PartialPickMatching } from "./utils.js";
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
/** Comparison Operators */
export type ComparisonOperators<T = any> = {
    $gt?: PartialOfType<T, number>;
    $lt?: PartialOfType<T, number>;
    $gte?: PartialOfType<T, number>;
    $lte?: PartialOfType<T, number>;
    $between?: PartialOfType<T, [number, number], number>;
    $in?: Partial<Record<keyof T, T[keyof T][]>>;
    $nin?: Partial<Record<keyof T, T[keyof T][]>>;
};
/** Type and Existence Operators */
export type TypeAndExistenceOperators<T = any> = {
    $exists?: PartialOfType<T, boolean, any>;
    $type?: PartialOfType<T, string>;
};
/** Array Operators */
export type ArrayOperators<T = any> = {
    $arrinc?: PartialPickMatching<T, any[]>;
    $arrincall?: PartialPickMatching<T, any[]>;
    $size?: PartialOfType<T, number>;
};
/** String Operators */
export type StringOperators<T = any> = {
    $regex?: PartialOfType<T, RegExp, string>;
    $startsWith?: PartialOfType<T, string>;
    $endsWith?: PartialOfType<T, string>;
};
/** Other Operators */
export type OtherOperators<T = any> = {
    $subset?: Partial<Record<keyof T, T[keyof T]>>;
};
/** Predefined Search Operators */
export type PredefinedSearchOperators<T = any> = LogicalOperators<T> & ComparisonOperators<T> & TypeAndExistenceOperators<T> & ArrayOperators<T> & StringOperators<T> & OtherOperators<T>;
/**
 * SearchOptions can be either a function or an object with predefined operators.
 */
export type SearchOptions<T = any> = PredefinedSearchOperators<T> & Arg<T>;
