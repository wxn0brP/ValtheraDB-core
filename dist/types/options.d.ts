import { ActionsBase } from "../base/actions.js";
import { Executor } from "../helpers/executor.js";
import { KeysMatching } from "./utils.js";
export type AdapterValue = ActionsBase | (() => Promise<ActionsBase>);
type AdapterOption = {
    adapter: AdapterValue;
    /** @deprecated use `adapter` */
    dbAction?: AdapterValue;
} | {
    adapter?: AdapterValue;
    /** @deprecated use `adapter` */
    dbAction: AdapterValue;
};
export type DbOpts = AdapterOption & {
    executor?: Executor;
    numberId?: boolean;
};
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
    select?: KeysMatching<T, any>[];
    exclude?: KeysMatching<T, any>[];
    transform?: Function;
}
export {};
