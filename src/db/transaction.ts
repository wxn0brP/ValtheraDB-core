import { wrapAdapterError } from "../errors";
import { Collection, resolveCollection } from "../helpers/collection";
import {
	applyAddDefaults,
	applyBulkAddDefaults,
	applyCountDefaults,
	applyFindDefaults,
	applyFindOneDefaults,
	applyRemoveDefaults,
	applyToggleOneDefaults,
	applyUpdateDefaults,
	applyUpdateOneOrAddDefaults,
} from "../helpers/queryDefaults";
import { Data } from "../types/data";
import { VQueryT } from "../types/query";
import { TransactionHandle } from "../types/transaction";
import { ValtheraCompatible } from "../types/valthera";
import { ValtheraClass } from "./valthera";

/**
 * Transaction context. Operations are executed directly through the parent
 * database with the transaction handle passed to the executor.
 */
export class Transaction {
	constructor(
		public readonly handle: TransactionHandle,
		public _parent: ValtheraClass,
	) {}

	c<T = Data>(name: string): Collection<T> {
		return new Collection<T>(this as unknown as ValtheraCompatible, name);
	}

	add<T = Data>(q: VQueryT.Add<T>) {
		applyAddDefaults(q);
		return this._parent.execute<T>("add", q, this.handle);
	}

	bulkAdd<T = Data>(q: VQueryT.BulkAdd<T>) {
		applyBulkAddDefaults(q);
		return this._parent.execute<T[]>("bulkAdd", q, this.handle);
	}

	find<T = Data>(q: VQueryT.Find<T, true>) {
		applyFindDefaults(q);
		return this._parent.execute<T[]>("find", q, this.handle);
	}

	findOne<T = Data>(q: VQueryT.FindOne<T>) {
		applyFindOneDefaults(q);
		return this._parent.execute<T | null>("findOne", q, this.handle);
	}

	update<T = Data>(q: VQueryT.Update<T>) {
		applyUpdateDefaults(q);
		return this._parent.execute<T[]>("update", q, this.handle);
	}

	updateOne<T = Data>(q: VQueryT.Update<T>) {
		applyUpdateDefaults(q);
		return this._parent.execute<T | null>("updateOne", q, this.handle);
	}

	remove<T = Data>(q: VQueryT.Remove<T>) {
		applyRemoveDefaults(q);
		return this._parent.execute<T[]>("remove", q, this.handle);
	}

	removeOne<T = Data>(q: VQueryT.Remove<T>) {
		applyRemoveDefaults(q);
		return this._parent.execute<T | null>("removeOne", q, this.handle);
	}

	updateOneOrAdd<T = Data>(q: VQueryT.UpdateOneOrAdd<T>) {
		applyUpdateOneOrAddDefaults(q);
		return this._parent.execute<VQueryT.UpdateOneOrAddResult<T>>(
			"updateOneOrAdd",
			q,
			this.handle,
		);
	}

	toggleOne<T = Data>(q: VQueryT.ToggleOne<T>) {
		applyToggleOneDefaults(q);
		return this._parent.execute<VQueryT.ToggleOneResult<T>>(
			"toggleOne",
			q,
			this.handle,
		);
	}

	count<T = Data>(q: VQueryT.Count<T>) {
		applyCountDefaults(q);
		return this._parent.execute<number>("count", q, this.handle);
	}

	ensureCollection(collection: string | VQueryT.Collection) {
		return this._parent.execute<boolean>(
			"ensureCollection",
			resolveCollection(collection),
			this.handle,
		);
	}

	issetCollection(collection: string | VQueryT.Collection) {
		return this._parent.execute<boolean>(
			"issetCollection",
			resolveCollection(collection),
			this.handle,
		);
	}

	getCollections() {
		return this._parent.execute<string[]>("getCollections", {}, this.handle);
	}

	removeCollection(target: string | VQueryT.Collection) {
		return this._parent.execute<boolean>(
			"removeCollection",
			resolveCollection(target),
			this.handle,
		);
	}

	async commit() {
		try {
			await this._parent.adapter.commitTransaction(this.handle);
		} catch (err) {
			throw wrapAdapterError(err, {
				op: "commitTransaction",
				adapter: this._parent.adapter?.version,
			});
		}
	}

	async rollback() {
		try {
			await this._parent.adapter.rollbackTransaction(this.handle);
		} catch (err) {
			throw wrapAdapterError(err, {
				op: "rollbackTransaction",
				adapter: this._parent.adapter?.version,
			});
		}
	}
}
