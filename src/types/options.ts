import { ActionsBase } from "../base/actions";
import { Executor } from "../helpers/executor";
import { KeysMatching } from "./utils";

export type AdapterValue = ActionsBase | (() => Promise<ActionsBase>);

type AdapterOption =
	| {
			adapter: AdapterValue;
			/** @deprecated use `adapter` */
			dbAction?: AdapterValue;
	  }
	| {
			adapter?: AdapterValue;
			/** @deprecated use `adapter` */
			dbAction: AdapterValue;
	  };

export type DbOpts = AdapterOption & {
	executor?: Executor;
	numberId?: boolean;
};

export type FieldPath<T = any> =
	| KeysMatching<T, any>
	| (string & {})
	| string[];

export interface DbFindOpts<T = any> {
	reverse?: boolean;
	limit?: number;
	offset?: number;
	sortBy?: KeysMatching<T, any>;
	sortAsc?: boolean;
	min?: Record<string, KeysMatching<T, number>>;
	max?: Record<string, KeysMatching<T, number>>;
	avg?: Record<string, KeysMatching<T, number>>;
	groupBy?: KeysMatching<T, any> | KeysMatching<T, any>[];
	count?: Record<string, string>;
}

export interface FindOpts<T = any> {
	select?: FieldPath<T>[];
	exclude?: FieldPath<T>[];
	transform?: Function;
}
