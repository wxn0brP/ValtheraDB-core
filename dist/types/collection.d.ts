import { Arg } from "./arg.js";
import { VContext } from "./types.js";
export interface UpdateOneOrAdd<T> {
    add_arg?: Arg<T>;
    id_gen?: boolean;
    context?: VContext;
}
