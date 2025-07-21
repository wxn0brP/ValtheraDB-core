import { SearchOptions } from "./searchOpts";
import { VContext } from "./types";
import { UpdaterArg } from "./updater";

export type Arg<T = any> = {
    [K in keyof T]?: any;
} & Record<string, any>;

export type SearchFunc<T = any> = (data: T, context: VContext) => boolean;
export type UpdaterFunc<T = any> = (data: T, context: VContext) => boolean;

export type Search<T = any> = SearchOptions<T> | SearchFunc<T>;
export type Updater<T = any> = UpdaterArg<T> | UpdaterArg<T>[] | UpdaterFunc<T>;