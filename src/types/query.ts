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
export interface VQuery_Control {
    updateOneOrAdd?: {
        updated?: boolean;
    };
    toggleOne?: {
        data?: Data;
    };
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
