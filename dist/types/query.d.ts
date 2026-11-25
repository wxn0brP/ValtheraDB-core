import { Arg, Search, Updater } from "./arg.js";
import { Data } from "./data.js";
import { IndexDefinition } from "./indexes.js";
import { DbFindOpts, FindOpts } from "./options.js";
import { TransactionHandle } from "./transaction.js";
/**
 * To extend via adapters
 * @example
 * declare module "@wxn0brp/db-core/types/query" {
 *   export interface VQuery_Control {
 *     key?: "value";
 *   }
 * }
 */
export interface VQuery_Control {
}
export interface VQuery<T = Data> {
    /** logic path, dir or file, depends on context */
    collection?: string;
    search?: Search<T>;
    dbFindOpts?: DbFindOpts<T>;
    findOpts?: FindOpts<T>;
    data?: Arg<T>;
    datas?: Arg<T>[];
    id_gen?: boolean;
    add_arg?: Arg<T>;
    updater?: Updater<T>;
    control?: VQuery_Control;
    transaction?: TransactionHandle;
    index?: IndexDefinition;
}
export declare namespace VQueryT {
    type QueryBase<T = Data> = {
        collection: string;
        control?: VQuery_Control;
        transaction?: TransactionHandle;
    };
    type Add<T = Data> = QueryBase<T> & {
        data: Arg<T>;
        id_gen?: boolean;
    };
    type BulkAdd<T = Data> = QueryBase<T> & {
        datas: Arg<T>[];
        id_gen?: boolean;
    };
    type Find<T = Data> = QueryBase<T> & {
        search?: NoInfer<Search<T>>;
        findOpts?: FindOpts<T>;
        dbFindOpts?: DbFindOpts<T>;
    };
    type FindOne<T = Data> = QueryBase<T> & {
        search: NoInfer<Search<T>>;
        findOpts?: FindOpts<T>;
    };
    type Update<T = Data> = QueryBase<T> & {
        search: NoInfer<Search<T>>;
        updater: NoInfer<Updater<T>>;
    };
    type Remove<T = Data> = QueryBase<T> & {
        search: NoInfer<Search<T>>;
    };
    type UpdateOneOrAdd<T = Data> = QueryBase<T> & {
        search: NoInfer<Search<T>>;
        updater: NoInfer<Updater<T>>;
        add_arg?: NoInfer<Arg<T>>;
        id_gen?: boolean;
    };
    type ToggleOne<T = Data> = QueryBase<T> & {
        search: NoInfer<Search<T>>;
        data: NoInfer<Arg<T>>;
    };
    interface UpdateOneOrAddResult<T> {
        data: T;
        type: "added" | "updated";
    }
    interface ToggleOneResult<T> {
        data: T;
        type: "added" | "removed";
    }
    type CreateIndex<T = Data> = QueryBase<T> & {
        index: IndexDefinition;
    };
    type RemoveIndex<T = Data> = QueryBase<T> & {
        index: IndexDefinition;
    };
    type Count<T = Data> = QueryBase<T> & {
        search?: NoInfer<Search<T>>;
    };
    interface Collection {
        collection: string;
    }
}
