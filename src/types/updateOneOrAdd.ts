import { Arg } from "./arg";
import { VContext } from "./context";

export interface UpdateOneOrAdd<T> {
	add_arg?: Arg<T>;
	id_gen?: boolean;
	/** @deprecated */
	context?: VContext;
}
