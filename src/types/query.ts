import { VContext } from "./types";
import { Arg, Search, Updater } from "./arg";
import { DbFindOpts, FindOpts } from "./options";

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