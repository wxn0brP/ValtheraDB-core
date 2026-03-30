import { ActionsBase } from "../base/actions.js";
import { Executor } from "../helpers/executor.js";
import { KeysMatching } from "./utils.js";
export interface DbOpts {
    dbAction: ActionsBase;
    executor?: Executor;
    numberId?: boolean;
}
export interface DbFindOpts<T = any> {
    reverse?: boolean;
    limit?: number;
    offset?: number;
    sortBy?: KeysMatching<T, any>;
    sortAsc?: boolean;
}
export interface FindOpts<T = any> {
    select?: KeysMatching<T, any>[];
    exclude?: KeysMatching<T, any>[];
    transform?: Function;
}
