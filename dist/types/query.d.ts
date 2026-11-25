import { Arg, Search, Updater } from "./arg";
import { Data } from "./data";
import { IndexDefinition } from "./indexes";
import { DbFindOpts, FindOpts } from "./options";
import { TransactionHandle } from "./transaction";
export interface VQuery_Control {
}
export interface VQuery<T = Data> {
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
