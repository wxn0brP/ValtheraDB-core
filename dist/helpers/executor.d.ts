export interface Task {
    func: Function;
    param: any[];
    resolve: Function;
    reject: Function;
}
export declare class Executor {
    quote: Task[];
    isExecuting: boolean;
    constructor();
    addOp(func: Function, ...param: any[]): Promise<unknown>;
    execute(): Promise<void>;
}
