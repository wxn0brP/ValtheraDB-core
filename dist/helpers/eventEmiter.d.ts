export declare class UniversalEventEmitter {
    private _events;
    on(event: string, listener: Function): void;
    once(event: string, listener: Function): void;
    off(event?: string, listener?: Function): void;
    emit(event: string, ...args: any[]): void;
    listenerCount(event: string): number;
}
