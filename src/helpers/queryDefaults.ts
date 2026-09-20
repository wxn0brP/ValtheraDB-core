import { VQueryT } from "../types/query";

export function applyAddDefaults<T>(q: VQueryT.Add<T>) {
	q.control ||= {};
	q.id_gen ??= true;
}

export function applyFindDefaults<T>(q: VQueryT.Find<T>) {
	q.search ||= {};
	q.dbFindOpts ||= {};
	q.findOpts ||= {};
	q.context ||= {};
	q.control ||= {};
}

export function applyFindOneDefaults<T>(q: VQueryT.FindOne<T>) {
	q.findOpts ||= {};
	q.context ||= {};
	q.control ||= {};
}

export function applyUpdateDefaults<T>(q: VQueryT.Update<T>) {
	q.context ||= {};
	q.control ||= {};
}

export function applyRemoveDefaults<T>(q: VQueryT.Remove<T>) {
	q.context ||= {};
	q.control ||= {};
}

export function applyUpdateOneOrAddDefaults<T>(q: VQueryT.UpdateOneOrAdd<T>) {
	q.context ||= {};
	q.add_arg ||= {};
	q.control ||= {};
	q.id_gen ??= true;
}

export function applyToggleOneDefaults<T>(q: VQueryT.ToggleOne<T>) {
	q.data ||= {};
	q.context ||= {};
	q.control ||= {};
}
