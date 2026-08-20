import { ActionsBase } from "../base/actions";
import { Executor } from "../helpers/executor";
import { KeysMatching } from "./utils";
export type AdapterValue = ActionsBase | (() => Promise<ActionsBase>);
export interface DbOpts {
    adapter: AdapterValue;
    executor?: Executor;
    adapterOpts?: AdapterOpts;
}
export interface AdapterOpts {
    numberId?: boolean;
    idKey?: string;
}
export type FieldPath<T = any> = KeysMatching<T, any> | (string & {}) | string[];
export interface DbFindOpts<T = any> {
    reverse?: boolean;
    limit?: number;
    offset?: number;
    sortBy?: KeysMatching<T, any> | {
        field: KeysMatching<T, any>;
        asc?: boolean;
    }[];
    sortAsc?: boolean;
    min?: Record<string, KeysMatching<T, number>>;
    max?: Record<string, KeysMatching<T, number>>;
    avg?: Record<string, KeysMatching<T, number>>;
    sum?: Record<string, KeysMatching<T, number>>;
    distinct?: KeysMatching<T, any>;
    groupBy?: KeysMatching<T, any> | KeysMatching<T, any>[];
    count?: Record<string, string>;
}
export interface FindOpts<T = any> {
    select?: FieldPath<T>[];
    exclude?: FieldPath<T>[];
    transform?: Function;
}
