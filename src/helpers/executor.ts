export interface Task {
	func: Function;
	param: any[];
	resolve: Function;
	reject: Function;
}

export interface ExecutorInterface {
	addOp(func: Function, query?: any, collection?: string): Promise<any>;
}

export interface SmartExecutorEntry {
	executor: Executor;
	interval: ReturnType<typeof setTimeout> | null;
}

const defaultCollection = "__default__";

/**
 * A simple executor for queuing and executing asynchronous operations sequentially.
 */
export class Executor implements ExecutorInterface {
	queue: Task[] = [];
	isExecuting: boolean = false;

	/**
	 * Add an asynchronous operation to the execution queue.
	 */
	async addOp(func: Function, query: any) {
		return await new Promise<any>((resolve, reject) => {
			this.queue.push({
				func,
				param: [
					query,
				],
				resolve,
				reject,
			});
			this.execute();
		});
	}

	/**
	 * Execute the queued asynchronous operations sequentially.
	 */
	async execute() {
		if (this.isExecuting) return;
		this.isExecuting = true;
		while (this.queue.length > 0) {
			const q = this.queue.shift();
			await q
				.func(...q.param)
				.then(q.resolve)
				.catch(q.reject);
		}
		this.isExecuting = false;
	}
}

/**
 * A smart executor for queuing and executing asynchronous operations with a TTL.
 */
export class SmartExecutor implements ExecutorInterface {
	collections: Map<string, SmartExecutorEntry> = new Map();

	constructor(
		public ttl = 5 * 60 * 1000,
		public aware = true,
	) {}

	async addOp(func: Function, query: any, collection: string) {
		const key = this.aware
			? (collection ?? defaultCollection)
			: defaultCollection;

		let entry = this.collections.get(key);

		if (!entry) {
			entry = {
				executor: new Executor(),
				interval: null,
			};
			this.collections.set(key, entry);
		} else if (entry.interval) clearTimeout(entry.interval);
		entry.interval = this.scheduleCleanup(key, entry);

		return entry.executor.addOp(func, query);
	}

	scheduleCleanup(key: string, entry: SmartExecutorEntry) {
		const interval = setTimeout(() => {
			const current = this.collections.get(key);
			if (!current || current !== entry) return;

			if (current.executor.isExecuting) {
				current.interval = this.scheduleCleanup(key, current);
			} else {
				this.collections.delete(key);
			}
		}, this.ttl);
		if (typeof interval === "object" && "unref" in (interval as any))
			(interval as any).unref();
		return interval;
	}
}
