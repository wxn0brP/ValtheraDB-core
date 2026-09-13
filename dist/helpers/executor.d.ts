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
export declare class Executor implements ExecutorInterface {
    queue: Task[];
    isExecuting: boolean;
    addOp(func: Function, query: any): Promise<any>;
    execute(): Promise<void>;
}
export declare class SmartExecutor implements ExecutorInterface {
    ttl: number;
    aware: boolean;
    collections: Map<string, SmartExecutorEntry>;
    constructor(ttl?: number, aware?: boolean);
    addOp(func: Function, query: any, collection: string): Promise<any>;
    scheduleCleanup(key: string, entry: SmartExecutorEntry): number;
}
