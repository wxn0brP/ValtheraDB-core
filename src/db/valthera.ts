import { VEE } from "@wxn0brp/event-emitter";
import { ActionsBase } from "../base/actions";
import { Collection } from "../helpers/collection";
import { ExecutorInterface, SmartExecutor } from "../helpers/executor";
import { genId } from "../helpers/gen";
import {
	applyAddDefaults,
	applyFindDefaults,
	applyFindOneDefaults,
	applyRemoveDefaults,
	applyToggleOneDefaults,
	applyUpdateDefaults,
	applyUpdateOneOrAddDefaults,
} from "../helpers/queryDefaults";
import { Data } from "../types/data";
import { DbOpts } from "../types/options";
import { PluginContext, ValtheraPlugin } from "../types/plugin";
import { VQuery, VQueryT } from "../types/query";
import { TransactionHandle } from "../types/transaction";
import { ValtheraCompatible } from "../types/valthera";
import { version } from "../version";
import { Transaction } from "./transaction";

/**
 * Represents a database management class for performing CRUD operations.
 * @class
 */
export class ValtheraClass implements ValtheraCompatible {
	adapter: ActionsBase;
	executor: ExecutorInterface;
	emitter: VEE<
		{
			[K in keyof ValtheraCompatible]: (
				query: VQuery,
				result: Awaited<ReturnType<ValtheraCompatible[K]>>,
			) => void;
		} & {
			"*": (name: keyof ValtheraCompatible, query: VQuery, result: any) => void;
		}
	> = new VEE();
	version = version;

	_plugins: ValtheraPlugin[] = [];
	_collections: Map<string, Collection<any>> = new Map();

	plugin(p: ValtheraPlugin) {
		p.init?.(this);
		this._plugins.push(p);
		return () => {
			const i = this._plugins.indexOf(p);
			if (i !== -1) this._plugins.splice(i, 1);
		};
	}

	constructor(public options: DbOpts) {
		this.executor = options.executor || new SmartExecutor(undefined, false);

		if (typeof options.adapter === "function") return;
		else {
			this.adapter = options.adapter as ActionsBase;
			if (options.adapterOpts) {
				this.adapter.adapterOpts = options.adapterOpts;
			}
		}

		options.executorAware ??= true;
	}

	async init(...args: any[]) {
		if (this.adapter?._inited) return;

		const self = this;
		return await this.executor.addOp(async () => {
			if (self.adapter?._inited) return;

			if (typeof self.options.adapter === "function")
				self.adapter = await (self.options.adapter as any)();

			// if the executor is not set, and the action wants a smart executor
			if (
				!self.options.executor &&
				self.options.executorAware &&
				self.adapter.smartExecutor &&
				self.executor instanceof SmartExecutor
			)
				self.executor.aware = true;

			if (self.options.adapterOpts) {
				self.adapter.adapterOpts = {
					...self.adapter.adapterOpts,
					...self.options.adapterOpts,
				};
			}

			await self.adapter.init(...args);
			self.adapter._inited = true;
		});
	}

	async close(...args: any[]) {
		if (!this.adapter._inited) return;
		const self = this;
		return await this.executor.addOp(async () => {
			if (!self.adapter._inited) return;
			await self.adapter.close(...args);
			self.adapter._inited = false;
		});
	}

	async execute<T>(
		name: keyof ValtheraCompatible,
		query: VQuery<any> | string,
		txHandle?: TransactionHandle,
	) {
		await this.init();

		if (txHandle && typeof query === "object") query.transaction = txHandle;

		const plugins = this._plugins;
		const self = this;
		let idx = 0;

		const ctx: PluginContext = {
			op: name as string,
			query,
			next: async () => {
				if (idx < plugins.length) return plugins[idx++].execute(ctx);
				if (txHandle) return self.adapter[ctx.op](query, txHandle);

				return self.executor.addOp(
					self.adapter[ctx.op].bind(self.adapter),
					ctx.query,
					typeof ctx.query === "string" ? ctx.query : ctx.query.collection,
				);
			},
		};

		const result = await ctx.next();
		this.emitter.emit(ctx.op, ctx.query, result);
		return result as T;
	}

	/**
	 * Create a new instance of a Collection class.
	 */
	c<T = Data>(collection: string): Collection<T> {
		if (this._collections.has(collection))
			return this._collections.get(collection);
		const col = new Collection<T>(this, collection);
		this._collections.set(collection, col);
		return col;
	}

	/**
	 * Get the names of all available databases.
	 */
	async getCollections() {
		return await this.execute<string[]>("getCollections", {});
	}

	/**
	 * Check and create the specified collection if it doesn't exist.
	 */
	async ensureCollection(collection: string) {
		return await this.execute<boolean>("ensureCollection", collection);
	}

	/**
	 * Check if a collection exists.
	 */
	async issetCollection(collection: string) {
		return await this.execute<boolean>("issetCollection", collection);
	}

	/**
	 * Add data to a database.
	 */
	add<T = Data>(query: VQueryT.Add<T>) {
		applyAddDefaults(query);
		return this.execute<T>("add", query);
	}

	/**
	 * Find data in a database.
	 */
	find<T = Data>(query: VQueryT.Find<T>) {
		applyFindDefaults(query);
		return this.execute<T[]>("find", query);
	}

	/**
	 * Find one data entry in a database.
	 */
	findOne<T = Data>(query: VQueryT.FindOne<T>) {
		applyFindOneDefaults(query);
		return this.execute<T | null>("findOne", query);
	}

	/**
	 * Update data in a database.
	 */
	update<T = Data>(query: VQueryT.Update<T>) {
		applyUpdateDefaults(query);
		return this.execute<T[]>("update", query);
	}

	/**
	 * Update one data entry in a database.
	 */
	updateOne<T = Data>(query: VQueryT.Update<T>) {
		applyUpdateDefaults(query);
		return this.execute<T | null>("updateOne", query);
	}

	/**
	 * Remove data from a database.
	 */
	remove<T = Data>(query: VQueryT.Remove<T>) {
		applyRemoveDefaults(query);
		return this.execute<T[]>("remove", query);
	}

	/**
	 * Remove one data entry from a database.
	 */
	removeOne<T = Data>(query: VQueryT.Remove<T>) {
		applyRemoveDefaults(query);
		return this.execute<T | null>("removeOne", query);
	}

	/**
	 * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
	 */
	updateOneOrAdd<T = Data>(query: VQueryT.UpdateOneOrAdd<T>) {
		applyUpdateOneOrAddDefaults(query);
		return this.execute<VQueryT.UpdateOneOrAddResult<T>>(
			"updateOneOrAdd",
			query,
		);
	}

	/**
	 * Asynchronously removes one entry in a database or adds a new one if it doesn't exist. Usage e.g. for toggling a flag.
	 */
	toggleOne<T = Data>(query: VQueryT.ToggleOne<T>) {
		applyToggleOneDefaults(query);
		return this.execute<VQueryT.ToggleOneResult<T>>("toggleOne", query);
	}

	/**
	 * Removes a database collection from the database.
	 */
	removeCollection(collection: string) {
		this._collections.delete(collection);
		return this.execute<boolean>("removeCollection", collection);
	}

	/**
	 * @experimental
	 *
	 * Executes operations within a transaction. Automatically rolls back on error.
	 *
	 * Receives a transaction-scoped object (`tx`) whose operations are executed
	 * within the transaction context.
	 *
	 * This feature is highly experimental and may change or be removed at any time.
	 *
	 * - Transaction support depends on the adapter implementation.
	 * - Collections must be declared upfront to ensure proper locking.
	 * - Operations invoked via the original `db` reference are NOT part of the transaction.
	 */
	async transaction<T>(
		collections: string[],
		fn: (tx: Transaction) => Promise<T>,
	): Promise<T> {
		await this.init();

		const releases: Array<() => void> = [];

		const promises = collections.map(collection => {
			let started: () => void;
			const startedPromise = new Promise<void>(r => (started = r));

			this.executor.addOp(
				async () => {
					started();
					await new Promise<void>(resolve => releases.push(resolve));
				},
				undefined,
				collection,
			);

			return startedPromise;
		});

		await Promise.all(promises);

		const handle = await this.adapter.beginTransaction(genId());
		const tx = new Transaction(handle, this);

		try {
			const result = await fn(tx);
			await tx.commit();
			return result;
		} catch (err) {
			try {
				await tx.rollback();
			} catch (rollbackErr) {
				throw new AggregateError(
					[
						err,
						rollbackErr,
					],
					"Transaction failed and rollback failed",
				);
			}
			throw err;
		} finally {
			releases.forEach(release => release());
		}
	}
}
