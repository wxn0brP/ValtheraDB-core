import { VContext } from "./types.js";
import { Arg, Search, Updater } from "./arg.js";
import { DbFindOpts, FindOpts } from "./options.js";
/**
 * To extend via adapters
 * @example
 * declare module "@wxn0brp/db-core" {
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
