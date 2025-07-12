import Id from "./Id.js";
import { SearchOptions } from "./searchOpts.js";
import { VContext } from "./types.js";
import { UpdaterArg } from "./updater.js";
export interface Arg {
    _id?: Id;
    [key: string]: any;
}
export type SearchFunc<T = any> = (data: T, context: VContext) => boolean;
export type UpdaterFunc<T = any> = (data: T, context: VContext) => boolean;
export type Search<T = any> = SearchOptions | SearchFunc<T>;
export type Updater<T = any> = UpdaterArg | UpdaterArg[] | UpdaterFunc<T>;
