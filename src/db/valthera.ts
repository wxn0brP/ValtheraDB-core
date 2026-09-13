import { VEE } from "@wxn0brp/event-emitter";
import { ActionsBase } from "../base/actions";
import { Collection } from "../helpers/collection";
import { ExecutorInterface, SmartExecutor } from "../helpers/executor";
import { genId } from "../helpers/gen";
import { Data } from "../types/data";
import { DbOpts } from "../types/options";
import { PluginContext, ValtheraPlugin } from "../types/plugin";
import { VQuery, VQueryT } from "../types/query";
import { TransactionHandle } from "../types/transaction";
import { ValtheraCompatible } from "../types/valthera";
import { version } from "../version";

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
	_activeTx: TransactionHandle | null = null;

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
	) {
		await this.init();
		const isTransaction = this._activeTx && typeof query !== "string";

		if (isTransaction) {
			query.transaction = this._activeTx;
		}

		const plugins = this._plugins;
		const self = this;
		let idx = 0;

		const ctx: PluginContext = {
			op: name as string,
			query,
			next: async () => {
				if (idx < plugins.length) return plugins[idx++].execute(ctx);

				if (isTransaction) return self.adapter[name](query);

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
		query.control ||= {};
		query.id_gen ??= true;
		return this.execute<T>("add", query);
	}

	/**
	 * Find data in a database.
	 */
	find<T = Data>(query: VQueryT.Find<T>) {
		query.search ||= {};
		query.dbFindOpts ||= {};
		query.findOpts ||= {};
		query.context ||= {};
		query.control ||= {};
		return this.execute<T[]>("find", query);
	}

	/**
	 * Find one data entry in a database.
	 */
	findOne<T = Data>(query: VQueryT.FindOne<T>) {
		query.findOpts ||= {};
		query.context ||= {};
		query.control ||= {};
		return this.execute<T | null>("findOne", query);
	}

	/**
	 * Update data in a database.
	 */
	update<T = Data>(query: VQueryT.Update<T>) {
		query.context ||= {};
		query.control ||= {};
		return this.execute<T[]>("update", query);
	}

	/**
	 * Update one data entry in a database.
	 */
	updateOne<T = Data>(query: VQueryT.Update<T>) {
		query.context ||= {};
		query.control ||= {};
		return this.execute<T | null>("updateOne", query);
	}

	/**
	 * Remove data from a database.
	 */
	remove<T = Data>(query: VQueryT.Remove<T>) {
		query.context ||= {};
		query.control ||= {};
		return this.execute<T[]>("remove", query);
	}

	/**
	 * Remove one data entry from a database.
	 */
	removeOne<T = Data>(query: VQueryT.Remove<T>) {
		query.context ||= {};
		query.control ||= {};
		return this.execute<T | null>("removeOne", query);
	}

	/**
	 * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
	 */
	updateOneOrAdd<T = Data>(query: VQueryT.UpdateOneOrAdd<T>) {
		query.context ||= {};
		query.add_arg ||= {};
		query.control ||= {};
		query.id_gen ??= true;
		return this.execute<VQueryT.UpdateOneOrAddResult<T>>(
			"updateOneOrAdd",
			query,
		);
	}

	/**
	 * Asynchronously removes one entry in a database or adds a new one if it doesn't exist. Usage e.g. for toggling a flag.
	 */
	toggleOne<T = Data>(query: VQueryT.ToggleOne<T>) {
		query.data ||= {};
		query.context ||= {};
		query.control ||= {};
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
	 * This feature is highly experimental and may change or be removed at any time.
	 *
	 * - Requires `executorAware: false` in ValtheraClass options.
	 * - Transaction support depends on the executor implementation.
	 * - Nested transactions are not supported.
	 * - Transactions lock the whole database for the duration of the transaction.
	 */
	async transaction<T>(
		fn: (handle: TransactionHandle) => Promise<T>,
	): Promise<T> {
		await this.init();

		if ("aware" in this.executor && this.executor.aware) {
			throw new Error(
				"Transactions are not supported when using a smart executor. " +
					"Please use options.executorAware = false when creating the Valthera instance.",
			);
		}

		if (this._activeTx)
			throw new Error("Nested transactions are not supported");

		const self = this;

		return this.executor.addOp(async () => {
			if (self._activeTx)
				throw new Error("Nested transactions are not supported");

			const handle = await self.adapter.beginTransaction(genId());
			self._activeTx = handle;

			try {
				const result = await fn(handle);

				await self.adapter.commitTransaction(handle);

				return result;
			} catch (err) {
				try {
					await self.adapter.rollbackTransaction(handle);
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
				self._activeTx = null;
			}
		});
	}
}
