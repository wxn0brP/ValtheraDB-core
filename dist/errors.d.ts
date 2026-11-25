export declare const ErrorCodes: {
    readonly UNSUPPORTED_OPERATION: "UNSUPPORTED_OPERATION";
    readonly ADAPTER_ERROR: "ADAPTER_ERROR";
    readonly ADAPTER_INIT: "ADAPTER_INIT";
    readonly ADAPTER_CLOSE: "ADAPTER_CLOSE";
    readonly QUERY_INVALID: "QUERY_INVALID";
    readonly TRANSACTION_FAILED: "TRANSACTION_FAILED";
    readonly TRANSACTION_ROLLBACK_FAILED: "TRANSACTION_ROLLBACK_FAILED";
    readonly REMOTE_ERROR: "REMOTE_ERROR";
    readonly REMOTE_UNKNOWN: "REMOTE_UNKNOWN";
};
export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
export interface ValtheraErrorOpts {
    code: string;
    cause?: unknown;
    suggestion?: string;
    context?: Record<string, unknown>;
}
export interface ValtheraErrorWire {
    code?: string;
    message?: string;
    suggestion?: string;
    context?: Record<string, unknown>;
}
export declare class ValtheraError extends Error {
    code: string;
    suggestion?: string;
    context?: Record<string, unknown>;
    constructor(message: string, opts: ValtheraErrorOpts);
    toJSON(): {
        name: string;
        code: string;
        message: string;
        suggestion?: string | undefined;
        context?: Record<string, unknown> | undefined;
    };
}
export declare class UnsupportedOperationError extends ValtheraError {
    constructor(operation: string, context?: Record<string, unknown>);
}
export declare class QueryValidationError extends ValtheraError {
    constructor(reason: string, context?: Record<string, unknown>);
}
export declare class AdapterError extends ValtheraError {
    constructor(cause: unknown, context?: Record<string, unknown>);
}
export declare class AdapterInitError extends ValtheraError {
    constructor(cause: unknown, context?: Record<string, unknown>);
}
export declare class AdapterCloseError extends ValtheraError {
    constructor(cause: unknown, context?: Record<string, unknown>);
}
export declare class TransactionError extends ValtheraError {
    constructor(message: string, opts?: {
        cause?: unknown;
        context?: Record<string, unknown>;
        code?: string;
    });
}
export declare class RemoteError extends ValtheraError {
    constructor(cause: unknown, context?: Record<string, unknown>);
}
export declare function isValtheraError(e: unknown): e is ValtheraError;
export declare function wrapAdapterError(cause: unknown, context?: Record<string, unknown>): ValtheraError;
export declare function errorFromWire(payload: ValtheraErrorWire): ValtheraError;
