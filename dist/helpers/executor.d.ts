export interface Task {
    func: Function;
    param: any[];
    resolve: Function;
    reject: Function;
}
/**
 * A simple executor for queuing and executing asynchronous operations sequentially.
 */
export declare class Executor {
    quote: Task[];
    isExecuting: boolean;
    /**
     * Add an asynchronous operation to the execution queue.
     */
    addOp(func: Function, ...param: any[]): Promise<unknown>;
    /**
     * Execute the queued asynchronous operations sequentially.
     */
    execute(): Promise<void>;
}
