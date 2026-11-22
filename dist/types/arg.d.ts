import { IsStrict } from "./config.js";
import { SearchOptions } from "./searchOpts.js";
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
export type Search<T = any> = SearchOptions<T>;
export type Updater<T = any> = UpdaterArg<T>;
export {};
