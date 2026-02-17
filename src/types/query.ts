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

export type QueryBase<T = Data> = Required<Pick<VQuery<T>, "collection" | "search">> & Pick<VQuery<T>, "control">;
export type AddQuery<T = Data> = Required<Pick<VQuery<T>, "data" | "collection">> & Pick<VQuery<T>, "id_gen" | "control">;
export type FindQuery<T = Data> = Omit<QueryBase, "search"> & Pick<VQuery<T>, "search"> & Pick<VQuery<T>, "findOpts" | "dbFindOpts" | "context">;
export type FindOneQuery<T = Data> = QueryBase & Pick<VQuery<T>, "findOpts" | "context">;
export type UpdateQuery<T = Data> = QueryBase & Required<Pick<VQuery<T>, "updater">> & Pick<VQuery<T>, "context">;
export type RemoveQuery<T = Data> = QueryBase & Pick<VQuery<T>, "context">;
export type UpdateOneOrAddQuery<T = Data> = QueryBase & UpdateQuery & Pick<VQuery<T>, "add_arg" | "id_gen">;
export type ToggleOneQuery<T = Data> = QueryBase & Pick<VQuery<T>, "data" | "context">;

export interface UpdateOneOrAddResult<T> {
    data: T;
    type: "added" | "updated";
};

export interface ToggleOneResult<T> {
    data: T;
    type: "added" | "removed";
};
