export declare class ResultPromise<T extends {
    data: any;
    type: string;
}> extends Promise<T> {
    private _type?;
    private _data?;
    get type(): Promise<T["type"]>;
    get data(): Promise<T["data"]>;
    static get [Symbol.species](): PromiseConstructor;
    static wrap<S extends {
        data: any;
        type: string;
    }>(promise: Promise<S>): ResultPromise<S>;
}
