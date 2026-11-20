import { Data } from "./data";
import { IsStrict } from "./config";
import { SearchOptions } from "./searchOpts";
import { VContext } from "./context";
import { UpdaterArg } from "./updater";
import { FieldsOf, WithId } from "./utils";
type LooseArg<T = any> = {
    [K in keyof T]?: any;
} & Record<string, any>;
export type Arg<T = any> = IsStrict extends true ? FieldsOf<WithId<T>> : LooseArg<T>;
export type SearchFunc<T = any> = (data: T, context: VContext) => boolean;
export type UpdaterFunc<T = any> = (data: T, context: VContext) => Data | void;
export type Search<T = any, AllowFn extends boolean = true> = AllowFn extends true ? SearchOptions<T> | SearchFunc<T> : SearchOptions<T>;
export type Updater<T = any, AllowFn extends boolean = true> = AllowFn extends true ? UpdaterArg<T> | UpdaterFunc<T> : UpdaterArg<T>;
export {};
