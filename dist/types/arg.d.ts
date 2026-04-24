import { SearchOptions } from "./searchOpts.js";
import { VContext } from "./types.js";
import { UpdaterArg } from "./updater.js";
export type Arg<T = any> = {
    [K in keyof T]?: any;
} & Record<string, any>;
export type SearchFunc<T = any> = (data: T, context: VContext) => boolean;
export type UpdaterFunc<T = any> = (data: T, context: VContext) => boolean;
export type Search<T = any> = SearchOptions<T> | SearchFunc<T>;
export type Updater<T = any> = UpdaterArg<T> | UpdaterArg<T>[] | UpdaterFunc<T>;
