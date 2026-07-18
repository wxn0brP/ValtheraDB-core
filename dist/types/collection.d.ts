import { Arg } from "./arg";
import { VContext } from "./types";
export interface UpdateOneOrAdd<T> {
    add_arg?: Arg<T>;
    id_gen?: boolean;
    context?: VContext;
}
