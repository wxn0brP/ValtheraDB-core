import { Arg, Search, Updater } from "./arg.js";
import { Data } from "./data.js";
import { DbFindOpts, FindOpts } from "./options.js";
import { VContext } from "./types.js";
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
    context?: VContext;
    dbFindOpts?: DbFindOpts<T>;
    findOpts?: FindOpts<T>;
    data?: Arg<T>;
    id_gen?: boolean;
    add_arg?: Arg<T>;
    updater?: Updater<T>;
    control?: VQuery_Control;
}
export declare namespace VQueryT {
    type QueryBase<T = Data> = Required<Pick<VQuery<T>, "collection" | "search">> & Pick<VQuery<T>, "control">;
    type Add<T = Data> = Required<Pick<VQuery<T>, "data" | "collection">> & Pick<VQuery<T>, "id_gen" | "control">;
    type Find<T = Data> = Omit<QueryBase, "search"> & Pick<VQuery<T>, "search"> & Pick<VQuery<T>, "findOpts" | "dbFindOpts" | "context">;
    type FindOne<T = Data> = QueryBase & Pick<VQuery<T>, "findOpts" | "context">;
    type Update<T = Data> = QueryBase & Required<Pick<VQuery<T>, "updater">> & Pick<VQuery<T>, "context">;
    type Remove<T = Data> = QueryBase & Pick<VQuery<T>, "context">;
    type UpdateOneOrAdd<T = Data> = QueryBase & Update & Pick<VQuery<T>, "add_arg" | "id_gen">;
    type ToggleOne<T = Data> = QueryBase & Pick<VQuery<T>, "data" | "context">;
    interface UpdateOneOrAddResult<T> {
        data: T;
        type: "added" | "updated";
    }
    interface ToggleOneResult<T> {
        data: T;
        type: "added" | "removed";
    }
}
export type QueryBase<T = Data> = VQueryT.QueryBase<T>;
export type AddQuery<T = Data> = VQueryT.Add<T>;
export type FindQuery<T = Data> = VQueryT.Find<T>;
export type FindOneQuery<T = Data> = VQueryT.FindOne<T>;
export type UpdateQuery<T = Data> = VQueryT.Update<T>;
export type RemoveQuery<T = Data> = VQueryT.Remove<T>;
export type UpdateOneOrAddQuery<T = Data> = VQueryT.UpdateOneOrAdd<T>;
export type ToggleOneQuery<T = Data> = VQueryT.ToggleOne<T>;
export type UpdateOneOrAddResult<T> = VQueryT.UpdateOneOrAddResult<T>;
export type ToggleOneResult<T> = VQueryT.ToggleOneResult<T>;
