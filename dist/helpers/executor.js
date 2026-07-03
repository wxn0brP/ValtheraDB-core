const defaultCollection = "__default__";
/**
 * A simple executor for queuing and executing asynchronous operations sequentially.
 */
export class Executor {
    queue = [];
    isExecuting = false;
    /**
     * Add an asynchronous operation to the execution queue.
     */
    async addOp(func, query) {
        return await new Promise((resolve, reject) => {
            this.queue.push({
                func,
                param: [query],
                resolve,
                reject
            });
            this.execute();
        });
    }
    /**
     * Execute the queued asynchronous operations sequentially.
     */
    async execute() {
        if (this.isExecuting)
            return;
        this.isExecuting = true;
        while (this.queue.length > 0) {
            let q = this.queue.shift();
            let res = await q.func(...q.param);
            q.resolve(res);
        }
        this.isExecuting = false;
    }
}
/**
 * A smart executor for queuing and executing asynchronous operations with a TTL.
 */
export class SmartExecutor {
    ttl;
    aware;
    collections = new Map();
    constructor(ttl = 5 * 60 * 1000, aware = true) {
        this.ttl = ttl;
        this.aware = aware;
    }
    async addOp(func, query, collection) {
        const key = this.aware ?
            collection ?? defaultCollection :
            defaultCollection;
        let entry = this.collections.get(key);
        if (!entry) {
            entry = {
                executor: new Executor(),
                interval: null
            };
            this.collections.set(key, entry);
        }
        else if (entry.interval)
            clearTimeout(entry.interval);
        entry.interval = this.scheduleCleanup(key, entry);
        return entry.executor.addOp(func, query);
    }
    scheduleCleanup(key, entry) {
        const interval = setTimeout(() => {
            const current = this.collections.get(key);
            if (!current || current !== entry)
                return;
            if (current.executor.isExecuting) {
                current.interval = this.scheduleCleanup(key, current);
            }
            else {
                this.collections.delete(key);
            }
        }, this.ttl);
        if (typeof interval === "object" && "unref" in interval)
            interval.unref();
        return interval;
    }
}
