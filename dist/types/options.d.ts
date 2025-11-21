import ActionsBase from "../base/actions.js";
import executorC from "../helpers/executor.js";
import { KeysMatching } from "./utils.js";
export interface DbOpts {
    maxFileSize?: number;
    dbAction?: ActionsBase;
    executor?: executorC;
    numberId?: boolean;
}
export interface DbFindOpts<T = any> {
    reverse?: boolean;
    max?: number;
    offset?: number;
    sortBy?: KeysMatching<T, any>;
    sortAsc?: boolean;
}
export interface FindOpts<T = any> {
    select?: KeysMatching<T, any>[];
    exclude?: KeysMatching<T, any>[];
    transform?: Function;
}
