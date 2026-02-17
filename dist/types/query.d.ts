import { Arg, Search, Updater } from "./arg.js";
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
export interface VQuery {
    collection?: string;
    search?: Search;
    context?: VContext;
    dbFindOpts?: DbFindOpts;
    findOpts?: FindOpts;
    data?: Arg;
    id_gen?: boolean;
    add_arg?: Arg;
    updater?: Updater;
    control?: VQuery_Control;
}
export type QueryBase = Required<Pick<VQuery, "collection" | "search">> & Pick<VQuery, "control">;
export type AddQuery = Required<Pick<VQuery, "data" | "collection">> & Pick<VQuery, "id_gen" | "control">;
export type FindQuery = Omit<QueryBase, "search"> & Pick<VQuery, "search"> & Pick<VQuery, "findOpts" | "dbFindOpts" | "context">;
export type FindOneQuery = QueryBase & Pick<VQuery, "findOpts" | "context">;
export type UpdateQuery = QueryBase & Required<Pick<VQuery, "updater">> & Pick<VQuery, "context">;
export type RemoveQuery = QueryBase & Pick<VQuery, "context">;
export type UpdateOneOrAddQuery = QueryBase & UpdateQuery & Pick<VQuery, "add_arg" | "id_gen">;
export type ToggleOneQuery = QueryBase & Pick<VQuery, "data" | "context">;
export interface UpdateOneOrAddResult<T> {
    data: T;
    type: "added" | "updated";
}
export interface ToggleOneResult<T> {
    data: T;
    type: "added" | "removed";
}
