import { Arg, Search, Updater } from "./arg";
import { Data } from "./data";
import { DbFindOpts, FindOpts } from "./options";
import { VContext } from "./types";

/**
 * To extend via adapters
 * @example
 * declare module "@wxn0brp/db-core/types/query" {
 *   export interface VQuery_Control {
 *     key?: "value";
 *   }
 * }
 */
export interface VQuery_Control { }

export interface VQuery<T = Data> {
    /** logic path, dir or file, depends on context */
    collection?: string;
    search?: Search<T>;
    context?: VContext;
    dbFindOpts?: DbFindOpts<T>;
    findOpts?: FindOpts<T>;
    data?: Arg<T>;
    id_gen?: boolean;
    add_arg?: Arg<T>;
    updater?: Updater<T>;
    control?: VQuery_Control;
}

export namespace VQueryT {
    export type QueryBase<T = Data> = Required<Pick<VQuery<T>, "collection" | "search">> & Pick<VQuery<T>, "control">;
    export type Add<T = Data> = Required<Pick<VQuery<T>, "data" | "collection">> & Pick<VQuery<T>, "id_gen" | "control">;
    export type Find<T = Data> = Omit<QueryBase, "search"> & Pick<VQuery<T>, "search"> & Pick<VQuery<T>, "findOpts" | "dbFindOpts" | "context">;
    export type FindOne<T = Data> = QueryBase & Pick<VQuery<T>, "findOpts" | "context">;
    export type Update<T = Data> = QueryBase & Required<Pick<VQuery<T>, "updater">> & Pick<VQuery<T>, "context">;
    export type Remove<T = Data> = QueryBase & Pick<VQuery<T>, "context">;
    export type UpdateOneOrAdd<T = Data> = QueryBase & Update & Pick<VQuery<T>, "add_arg" | "id_gen">;
    export type ToggleOne<T = Data> = QueryBase & Pick<VQuery<T>, "data" | "context">;

    export interface UpdateOneOrAddResult<T> {
        data: T;
        type: "added" | "updated";
    };

    export interface ToggleOneResult<T> {
        data: T;
        type: "added" | "removed";
    };
}

/** @deprecated */
export type QueryBase<T = Data> = VQueryT.QueryBase<T>;
/** @deprecated */
export type AddQuery<T = Data> = VQueryT.Add<T>;
/** @deprecated */
export type FindQuery<T = Data> = VQueryT.Find<T>;
/** @deprecated */
export type FindOneQuery<T = Data> = VQueryT.FindOne<T>;
/** @deprecated */
export type UpdateQuery<T = Data> = VQueryT.Update<T>;
/** @deprecated */
export type RemoveQuery<T = Data> = VQueryT.Remove<T>;
/** @deprecated */
export type UpdateOneOrAddQuery<T = Data> = VQueryT.UpdateOneOrAdd<T>;
/** @deprecated */
export type ToggleOneQuery<T = Data> = VQueryT.ToggleOne<T>;
/** @deprecated */
export type UpdateOneOrAddResult<T> = VQueryT.UpdateOneOrAddResult<T>;
/** @deprecated */
export type ToggleOneResult<T> = VQueryT.ToggleOneResult<T>;
