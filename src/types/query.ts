import { Arg, Search, Updater } from "./arg";
import { Data } from "./data";
import { DbFindOpts, FindOpts } from "./options";
import { VContext } from "./types";

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

export interface VQuery<T = Data, AllowFn extends boolean = true> {
	/** logic path, dir or file, depends on context */
	collection?: string;
	search?: Search<T, AllowFn>;
	context?: VContext;
	dbFindOpts?: DbFindOpts<T>;
	findOpts?: FindOpts<T>;
	data?: Arg<T>;
	id_gen?: boolean;
	add_arg?: Arg<T>;
	updater?: Updater<T, AllowFn>;
	control?: VQuery_Control;
}

export namespace VQueryT {
	export type QueryBase<T = Data> = {
		collection: string;
		control?: VQuery_Control;
	};

	export type Add<T = Data> = QueryBase<T> & {
		data: Arg<T>;
		id_gen?: boolean;
	};

	export type Find<T = Data, AllowFn extends boolean = true> = QueryBase<T> & {
		search?: Search<T, AllowFn>;
		findOpts?: FindOpts<T>;
		dbFindOpts?: DbFindOpts<T>;
		context?: VContext;
	};

	export type FindOne<
		T = Data,
		AllowFn extends boolean = true,
	> = QueryBase<T> & {
		search: Search<T, AllowFn>;
		findOpts?: FindOpts<T>;
		context?: VContext;
	};

	export type Update<
		T = Data,
		AllowFn extends boolean = true,
	> = QueryBase<T> & {
		search: Search<T, AllowFn>;
		updater: Updater<T, AllowFn>;
		context?: VContext;
	};

	export type Remove<
		T = Data,
		AllowFn extends boolean = true,
	> = QueryBase<T> & {
		search: Search<T, AllowFn>;
		context?: VContext;
	};

	export type UpdateOneOrAdd<
		T = Data,
		AllowFn extends boolean = true,
	> = QueryBase<T> & {
		search: Search<T, AllowFn>;
		updater: Updater<T, AllowFn>;
		add_arg?: Arg<T>;
		id_gen?: boolean;
		context?: VContext;
	};

	export type ToggleOne<
		T = Data,
		AllowFn extends boolean = true,
	> = QueryBase<T> & {
		search: Search<T, AllowFn>;
		data: Arg<T>;
		context?: VContext;
	};

	export interface UpdateOneOrAddResult<T> {
		data: T;
		type: "added" | "updated";
	}

	export interface ToggleOneResult<T> {
		data: T;
		type: "added" | "removed";
	}
}
