import { Data } from "./data.js";
import { SearchOptions } from "./searchOpts.js";
import { VContext } from "./types.js";
import { UpdaterArg } from "./updater.js";
export type Arg<T = any> = {
    [K in keyof T]?: any;
} & Record<string, any>;
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
