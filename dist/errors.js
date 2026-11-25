export const ErrorCodes = {
    UNSUPPORTED_OPERATION: "UNSUPPORTED_OPERATION",
    ADAPTER_ERROR: "ADAPTER_ERROR",
    ADAPTER_INIT: "ADAPTER_INIT",
    ADAPTER_CLOSE: "ADAPTER_CLOSE",
    QUERY_INVALID: "QUERY_INVALID",
    TRANSACTION_FAILED: "TRANSACTION_FAILED",
    TRANSACTION_ROLLBACK_FAILED: "TRANSACTION_ROLLBACK_FAILED",
    REMOTE_ERROR: "REMOTE_ERROR",
    REMOTE_UNKNOWN: "REMOTE_UNKNOWN",
};
export class ValtheraError extends Error {
    code;
    suggestion;
    context;
    constructor(message, opts) {
        super(message, {
            cause: opts.cause,
        });
        this.name = "ValtheraError";
        this.code = opts.code;
        this.suggestion = opts.suggestion;
        this.context = opts.context;
    }
    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            ...(this.suggestion
                ? {
                    suggestion: this.suggestion,
                }
                : {}),
            ...(this.context
                ? {
                    context: this.context,
                }
                : {}),
        };
    }
}
export class UnsupportedOperationError extends ValtheraError {
    constructor(operation, context = {}) {
        super(`Operation "${operation}" is not supported`, {
            code: ErrorCodes.UNSUPPORTED_OPERATION,
            context: {
                op: operation,
                ...context,
            },
            suggestion: "Check the adapter capabilities before calling this operation",
        });
        this.name = "UnsupportedOperationError";
    }
}
export class QueryValidationError extends ValtheraError {
    constructor(reason, context = {}) {
        super(reason, {
            code: ErrorCodes.QUERY_INVALID,
            context,
            suggestion: "Check the query shape and the collection name",
        });
        this.name = "QueryValidationError";
    }
}
export class AdapterError extends ValtheraError {
    constructor(cause, context = {}) {
        super(errorMessage(cause), {
            code: ErrorCodes.ADAPTER_ERROR,
            cause,
            context,
        });
        this.name = "AdapterError";
    }
}
export class AdapterInitError extends ValtheraError {
    constructor(cause, context = {}) {
        super(`Adapter init failed: ${errorMessage(cause)}`, {
            code: ErrorCodes.ADAPTER_INIT,
            cause,
            context,
        });
        this.name = "AdapterInitError";
    }
}
export class AdapterCloseError extends ValtheraError {
    constructor(cause, context = {}) {
        super(`Adapter close failed: ${errorMessage(cause)}`, {
            code: ErrorCodes.ADAPTER_CLOSE,
            cause,
            context,
        });
        this.name = "AdapterCloseError";
    }
}
export class TransactionError extends ValtheraError {
    constructor(message, opts = {}) {
        super(message, {
            code: opts.code ?? ErrorCodes.TRANSACTION_FAILED,
            cause: opts.cause,
            context: opts.context,
        });
        this.name = "TransactionError";
    }
}
export class RemoteError extends ValtheraError {
    constructor(cause, context = {}) {
        super(errorMessage(cause), {
            code: ErrorCodes.REMOTE_ERROR,
            cause,
            context,
        });
        this.name = "RemoteError";
    }
}
function errorMessage(cause) {
    return cause instanceof Error ? cause.message : String(cause);
}
export function isValtheraError(e) {
    return e instanceof ValtheraError;
}
/**
 * Copy a ValtheraError with merged context; keeps `instanceof` and `cause`
 */
function cloneWithContext(err, context) {
    const clone = Object.create(Object.getPrototypeOf(err));
    Object.assign(clone, err);
    clone.message = err.message;
    clone.stack = err.stack;
    clone.cause = err.cause;
    clone.context = {
        ...context,
        ...err.context,
    };
    return clone;
}
/**
 * Adapter errors: keep ValtheraError codes, else wrap into AdapterError.
 */
export function wrapAdapterError(cause, context = {}) {
    if (cause instanceof ValtheraError)
        return Object.keys(context).length
            ? cloneWithContext(cause, context)
            : cause;
    return new AdapterError(cause, context);
}
/**
 * Rebuild a ValtheraError from a server response; match by `code`, not class.
 */
export function errorFromWire(payload) {
    return new ValtheraError(payload.message ?? "Unknown remote error", {
        code: payload.code ?? ErrorCodes.REMOTE_UNKNOWN,
        suggestion: payload.suggestion,
        context: payload.context,
    });
}
