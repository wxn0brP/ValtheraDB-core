import { ActionsBase } from "../base/actions.js";
import { ExecutorInterface } from "../helpers/executor.js";
import { Data } from "./data.js";
import { Id } from "./Id.js";
import { TransactionHandle } from "./transaction.js";
import { KeysMatching } from "./utils.js";
export type AdapterValue = ActionsBase | (() => Promise<ActionsBase>);
/**
 * Custom ID generator. Receives only records without the ID key set and
 * returns generated IDs in the same order.
 */
export type IdGen = (data: Data[], collection: string, adapter: ActionsBase, transaction?: TransactionHandle) => Id[] | Promise<Id[]>;
export interface DbOpts {
    adapter: AdapterValue;
    executor?: ExecutorInterface;
    executorAware?: boolean;
    adapterOpts?: AdapterOpts;
}
export interface AdapterOpts {
    numberId?: boolean;
    idKey?: string;
    idGen?: IdGen;
    /** Parts lengths passed to `genId` for the default ID generator. */
    idParts?: number[];
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
