import { Arg, Search, Updater } from "./arg";
import { Data } from "./data";
import { DbFindOpts, FindOpts } from "./options";
import { VContext } from "./types";
export interface VQuery_Control {
}
export interface VQuery<T = Data, AllowFn extends boolean = true> {
    collection?: string;
    search?: Search<T, AllowFn>;
    context?: VContext;
    dbFindOpts?: DbFindOpts<T>;
    findOpts?: FindOpts<T>;
    data?: Arg<T>;
    id_gen?: boolean;
    add_arg?: Arg<T>;
    updater?: Updater<T, AllowFn>;
    control?: VQuery_Control;
}
export declare namespace VQueryT {
    type QueryBase<T = Data> = {
        collection: string;
        control?: VQuery_Control;
    };
    type Add<T = Data> = QueryBase<T> & {
        data: Arg<T>;
        id_gen?: boolean;
    };
    type Find<T = Data, AllowFn extends boolean = true> = QueryBase<T> & {
        search?: Search<T, AllowFn>;
        findOpts?: FindOpts<T>;
        dbFindOpts?: DbFindOpts<T>;
        context?: VContext;
    };
    type FindOne<T = Data, AllowFn extends boolean = true> = QueryBase<T> & {
        search: Search<T, AllowFn>;
        findOpts?: FindOpts<T>;
        context?: VContext;
    };
    type Update<T = Data, AllowFn extends boolean = true> = QueryBase<T> & {
        search: Search<T, AllowFn>;
        updater: Updater<T, AllowFn>;
        context?: VContext;
    };
    type Remove<T = Data, AllowFn extends boolean = true> = QueryBase<T> & {
        search: Search<T, AllowFn>;
        context?: VContext;
    };
    type UpdateOneOrAdd<T = Data, AllowFn extends boolean = true> = QueryBase<T> & {
        search: Search<T, AllowFn>;
        updater: Updater<T, AllowFn>;
        add_arg?: Arg<T>;
        id_gen?: boolean;
        context?: VContext;
    };
    type ToggleOne<T = Data, AllowFn extends boolean = true> = QueryBase<T> & {
        search: Search<T, AllowFn>;
        data: Arg<T>;
        context?: VContext;
    };
    interface UpdateOneOrAddResult<T> {
        data: T;
        type: "added" | "updated";
    }
    interface ToggleOneResult<T> {
        data: T;
        type: "added" | "removed";
    }
}
