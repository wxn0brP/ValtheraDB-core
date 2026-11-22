import { Arg, Search, Updater } from "../types/arg";
import { Data } from "../types/data";
import { IndexOpts } from "../types/indexes";
import { DbFindOpts, FindOpts } from "../types/options";
import { VQueryT } from "../types/query";
import { UpdateOneOrAdd } from "../types/updateOneOrAdd";
import { ValtheraCompatible } from "../types/valthera";

export function resolveCollection(target: string | VQueryT.Collection) {
	return typeof target === "string" ? target : target.collection;
}

export class Collection<D = Data> {
	constructor(
		public db: ValtheraCompatible,
		public collection: string,
	) {}

	/**
	 * Add data to a database.
	 */
	add(data: Arg<D>, id_gen: false): Promise<D>;
	add(
		data: Arg<D>,
		id_gen?: true,
	): Promise<
		D & {
			_id: string;
		}
	>;
	add(data: Arg<D>, id_gen?: boolean): Promise<D> {
		return this.db.add({
			collection: this.collection,
			data,
			id_gen,
		});
	}

	bulkAdd(data: Arg<D>[], id_gen: false): Promise<D[]>;
	bulkAdd(
		data: Arg<D>[],
		id_gen?: true,
	): Promise<
		(D & {
			_id: string;
		})[]
	>;
	bulkAdd(data: Arg<D>[], id_gen?: boolean): Promise<D[]> {
		return this.db.bulkAdd({
			collection: this.collection,
			datas: data,
			id_gen,
		});
	}

	/**
	 * Find data in a database.
	 */
	find(
		search: Search<D> = {},
		options: DbFindOpts<D> = {},
		findOpts: FindOpts<D> = {},
	) {
		return this.db.find<D>({
			collection: this.collection,
			search,
			dbFindOpts: options,
			findOpts,
		});
	}

	/**
	 * Find one data entry in a database.
	 */
	findOne(search: Search<D> = {}, findOpts: FindOpts<D> = {}) {
		return this.db.findOne<D>({
			collection: this.collection,
			search,
			findOpts,
		});
	}

	/**
	 * Count data entries in a database.
	 */
	count(search: Search<D> = {}) {
		return this.db.count({
			collection: this.collection,
			search: search as Search<Data>,
		});
	}

	/**
	 * Update data in a database.
	 */
	update(search: Search<D>, updater: Updater<D>) {
		return this.db.update<D>({
			collection: this.collection,
			search,
			updater,
		});
	}

	/**
	 * Update one data entry in a database.
	 */
	updateOne(search: Search<D>, updater: Updater<D>) {
		return this.db.updateOne<D>({
			collection: this.collection,
			search,
			updater,
		});
	}

	/**
	 * Remove data from a database.
	 */
	remove(search: Search<D>) {
		return this.db.remove<D>({
			collection: this.collection,
			search,
		});
	}

	/**
	 * Remove one data entry from a database.
	 */
	removeOne(search: Search<D>) {
		return this.db.removeOne<D>({
			collection: this.collection,
			search,
		});
	}

	/**
	 * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
	 */
	updateOneOrAdd(
		search: Search<D>,
		updater: Updater<D>,
		{ add_arg = {}, id_gen = true }: UpdateOneOrAdd<D> = {},
	) {
		return this.db.updateOneOrAdd<D>({
			collection: this.collection,
			search,
			updater,
			add_arg,
			id_gen,
		});
	}

	/**
	 * Asynchronously removes one entry in a database or adds a new one if it doesn't exist. Usage e.g. for toggling a flag.
	 */
	toggleOne(search: Search<D>, data: Arg<D> = {}) {
		return this.db.toggleOne<D>({
			collection: this.collection,
			search,
			data,
		});
	}

	/**
	 * Create an index on this collection.
	 */
	createIndex(fields: string[], opts?: IndexOpts) {
		return this.db.createIndex(this.collection, fields, opts);
	}

	/**
	 * Remove an index from this collection. Adapter-dependent.
	 */
	removeIndex(fields: string[]) {
		return this.db.removeIndex(this.collection, fields);
	}
}
