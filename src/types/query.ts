import { Arg, Search, Updater } from "./arg";
import { Data } from "./data";
import { IndexDefinition } from "./indexes";
import { DbFindOpts, FindOpts } from "./options";
import { TransactionHandle } from "./transaction";

/**
 * To extend via adapters
 * @example
 * declare module "@wxn0brp/db-core/types/query" {
 *   export interface VQuery_Control {
 *     key?: "value";
 *   }
 * }
 */
export interface VQuery_Control {}

export interface VQuery<T = Data> {
	/** logic path, dir or file, depends on context */
	collection?: string;
	search?: Search<T>;
	dbFindOpts?: DbFindOpts<T>;
	findOpts?: FindOpts<T>;
	data?: Arg<T>;
	datas?: Arg<T>[];
	id_gen?: boolean;
	add_arg?: Arg<T>;
	updater?: Updater<T>;
	control?: VQuery_Control;
	transaction?: TransactionHandle;
	index?: IndexDefinition;
}

export namespace VQueryT {
	export type QueryBase<T = Data> = {
		collection: string;
		control?: VQuery_Control;
		transaction?: TransactionHandle;
	};

	export type Add<T = Data> = QueryBase<T> & {
		data: Arg<T>;
		id_gen?: boolean;
	};

	export type BulkAdd<T = Data> = QueryBase<T> & {
		datas: Arg<T>[];
		id_gen?: boolean;
	};

	export type Find<T = Data> = QueryBase<T> & {
		search?: NoInfer<Search<T>>;
		findOpts?: FindOpts<T>;
		dbFindOpts?: DbFindOpts<T>;
	};

	export type FindOne<T = Data> = QueryBase<T> & {
		search: NoInfer<Search<T>>;
		findOpts?: FindOpts<T>;
	};

	export type Update<T = Data> = QueryBase<T> & {
		search: NoInfer<Search<T>>;
		updater: NoInfer<Updater<T>>;
	};

	export type Remove<T = Data> = QueryBase<T> & {
		search: NoInfer<Search<T>>;
	};

	export type UpdateOneOrAdd<T = Data> = QueryBase<T> & {
		search: NoInfer<Search<T>>;
		updater: NoInfer<Updater<T>>;
		add_arg?: NoInfer<Arg<T>>;
		id_gen?: boolean;
	};

	export type ToggleOne<T = Data> = QueryBase<T> & {
		search: NoInfer<Search<T>>;
		data: NoInfer<Arg<T>>;
	};

	export interface UpdateOneOrAddResult<T> {
		data: T;
		type: "added" | "updated";
	}

	export interface ToggleOneResult<T> {
		data: T;
		type: "added" | "removed";
	}

	export type CreateIndex<T = Data> = QueryBase<T> & {
		index: IndexDefinition;
	};

	export type RemoveIndex<T = Data> = QueryBase<T> & {
		index: IndexDefinition;
	};

	export type Count<T = Data> = QueryBase<T> & {
		search?: NoInfer<Search<T>>;
	};

	export interface Collection {
		collection: string;
	}
}
