import { DeepPartial, NestedValue } from "./utils";

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
	$gt?: NestedValue<T, number, number>;
	$lt?: NestedValue<T, number, number>;
	$gte?: NestedValue<T, number, number>;
	$lte?: NestedValue<T, number, number>;
	$between?: NestedValue<T, [number, number], number>;
	$in?: DeepPartial<T> & { [K in keyof T]?: T[K] extends any[] ? T[K] : T[K][] };
	$nin?: DeepPartial<T> & { [K in keyof T]?: T[K] extends any[] ? T[K] : T[K][] };
	$idGt?: NestedValue<T, string | number, string | number>;
	$idLt?: NestedValue<T, string | number, string | number>;
	$idGte?: NestedValue<T, string | number, string | number>;
	$idLte?: NestedValue<T, string | number, string | number>;
};

/** Type and Existence Operators with nested support */
export type TypeAndExistenceOperators<T = any> = {
	$exists?: NestedValue<T, boolean>;
	$type?: NestedValue<T, string>;
};

/** Array Operators with nested support */
export type ArrayOperators<T = any> = {
	$arrinc?: DeepPartial<T>;
	$arrincall?: DeepPartial<T>;
	$size?: NestedValue<T, number>;
};

/** String Operators with nested support */
export type StringOperators<T = any> = {
	$regex?: NestedValue<T, RegExp | string, string>;
	$startsWith?: NestedValue<T, string, string>;
	$endsWith?: NestedValue<T, string, string>;
};

/** Other Operators with nested support */
export type OtherOperators<T = any> = {
	$subset?: DeepPartial<T>;
};

/** Predefined Search Operators */
export type PredefinedSearchOperators<T = any> = LogicalOperators<T> &
	ComparisonOperators<T> &
	TypeAndExistenceOperators<T> &
	ArrayOperators<T> &
	StringOperators<T> &
	OtherOperators<T>;

/**
 * SearchOptions can be either a function or an object with predefined operators.
 */
export type SearchOptions<T = any> = PredefinedSearchOperators<T> & DeepPartial<T> & Record<string, any>;