import { Arg } from "./arg.js";
import { VContext } from "./context.js";
export interface UpdateOneOrAdd<T> {
    add_arg?: Arg<T>;
    id_gen?: boolean;
    /** @deprecated */
    context?: VContext;
}
