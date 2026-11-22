import { VQueryT } from "../types/query";

export function applyAddDefaults<T>(q: VQueryT.Add<T>) {
	q.control ||= {};
	q.id_gen ??= true;
}

export function applyFindDefaults<T>(q: VQueryT.Find<T>) {
	q.search ||= {};
	q.dbFindOpts ||= {};
	q.findOpts ||= {};
	q.control ||= {};
}

export function applyFindOneDefaults<T>(q: VQueryT.FindOne<T>) {
	q.findOpts ||= {};
	q.control ||= {};
}

export function applyUpdateDefaults<T>(q: VQueryT.Update<T>) {
	q.control ||= {};
}

export function applyRemoveDefaults<T>(q: VQueryT.Remove<T>) {
	q.control ||= {};
}

export function applyUpdateOneOrAddDefaults<T>(q: VQueryT.UpdateOneOrAdd<T>) {
	q.add_arg ||= {};
	q.control ||= {};
	q.id_gen ??= true;
}

export function applyToggleOneDefaults<T>(q: VQueryT.ToggleOne<T>) {
	q.data ||= {};
	q.control ||= {};
}

export function applyCountDefaults<T>(q: VQueryT.Count<T>) {
	q.search ||= {};
	q.control ||= {};
}

export function applyBulkAddDefaults<T>(q: VQueryT.BulkAdd<T>) {
	q.datas ??= [];
	q.control ||= {};
	q.id_gen ??= true;
}
