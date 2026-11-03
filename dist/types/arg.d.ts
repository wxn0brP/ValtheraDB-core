import { Data } from "./data.js";
import { IsStrict } from "./config.js";
import { SearchOptions } from "./searchOpts.js";
import { VContext } from "./types.js";
import { UpdaterArg } from "./updater.js";
import { FieldsOf, WithId } from "./utils.js";
type LooseArg<T = any> = {
    [K in keyof T]?: any;
} & Record<string, any>;
/**
 * Data payload (e.g. for `add`).
 * In strict mode fields and nested objects of `T` are allowed; otherwise any key is accepted.
 */
export type Arg<T = any> = IsStrict extends true ? FieldsOf<WithId<T>> : LooseArg<T>;
/**
 * Function-based search.
 * @deprecated Use operator objects or a plugin instead.
 */
export type SearchFunc<T = any> = (data: T, context: VContext) => boolean;
/**
 * Function-based updater.
 * @deprecated Use operator objects instead.
 */
export type UpdaterFunc<T = any> = (data: T, context: VContext) => Data | void;
export type Search<T = any, AllowFn extends boolean = true> = AllowFn extends true ? SearchOptions<T> | SearchFunc<T> : SearchOptions<T>;
export type Updater<T = any, AllowFn extends boolean = true> = AllowFn extends true ? UpdaterArg<T> | UpdaterFunc<T> : UpdaterArg<T>;
export {};
