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
/**
 * A simple executor for queuing and executing asynchronous operations sequentially.
 */
export declare class Executor implements ExecutorInterface {
    queue: Task[];
    isExecuting: boolean;
    /**
     * Add an asynchronous operation to the execution queue.
     */
    addOp(func: Function, query: any): Promise<any>;
    /**
     * Execute the queued asynchronous operations sequentially.
     */
    execute(): Promise<void>;
}
/**
 * A smart executor for queuing and executing asynchronous operations with a TTL.
 */
export declare class SmartExecutor implements ExecutorInterface {
    ttl: number;
    collections: Map<string, SmartExecutorEntry>;
    constructor(ttl?: number);
    addOp(func: Function, query: any, collection: string): Promise<any>;
    scheduleCleanup(key: string, entry: SmartExecutorEntry): number;
}
