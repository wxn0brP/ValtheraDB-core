import { AdapterBase } from "../base/adapter";
import { ExecutorInterface } from "../helpers/executor";
import { Data } from "./data";
import { Id } from "./Id";
import { TransactionHandle } from "./transaction";
import { KeysMatching } from "./utils";

export type AdapterValue = AdapterBase | (() => Promise<AdapterBase>);

/**
 * Custom ID generator. Receives only records without the ID key set and
 * returns generated IDs in the same order.
 */
export type IdGen = (
	data: Data[],
	collection: string,
	adapter: AdapterBase,
	transaction?: TransactionHandle,
) => Id[] | Promise<Id[]>;

export interface DbOpts {
	adapter: AdapterValue;
	executor?: ExecutorInterface;
	executorAware?: boolean;
	adapterOpts?: AdapterOpts;
}

export interface AdapterOpts {
	numberId?: boolean;
	idKey?: string;
	idGen?: IdGen;
	/** Parts lengths passed to `genId` for the default ID generator. */
	idParts?: number[];
}

export type FieldPath<T = any> =
	| KeysMatching<T, any>
	| (string & {})
	| string[];

export interface DbFindOpts<T = any> {
	reverse?: boolean;
	limit?: number;
	offset?: number;
	sortBy?:
		| KeysMatching<T, any>
		| {
				field: KeysMatching<T, any>;
				asc?: boolean;
		  }[];
	sortAsc?: boolean;
	min?: Record<string, KeysMatching<T, number>>;
	max?: Record<string, KeysMatching<T, number>>;
	avg?: Record<string, KeysMatching<T, number>>;
	sum?: Record<string, KeysMatching<T, number>>;
	distinct?: KeysMatching<T, any>;
	groupBy?: KeysMatching<T, any> | KeysMatching<T, any>[];
	count?: Record<string, string>;
}

export interface FindOpts<T = any> {
	select?: FieldPath<T>[];
	exclude?: FieldPath<T>[];
	transform?: Function;
}
