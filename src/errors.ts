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
} as const;

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

export class ValtheraError extends Error {
	code: string;
	suggestion?: string;
	context?: Record<string, unknown>;

	constructor(message: string, opts: ValtheraErrorOpts) {
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
	constructor(operation: string, context: Record<string, unknown> = {}) {
		super(`Operation "${operation}" is not supported`, {
			code: ErrorCodes.UNSUPPORTED_OPERATION,
			context: {
				op: operation,
				...context,
			},
			suggestion:
				"Check the adapter capabilities before calling this operation",
		});
		this.name = "UnsupportedOperationError";
	}
}

export class QueryValidationError extends ValtheraError {
	constructor(reason: string, context: Record<string, unknown> = {}) {
		super(reason, {
			code: ErrorCodes.QUERY_INVALID,
			context,
			suggestion: "Check the query shape and the collection name",
		});
		this.name = "QueryValidationError";
	}
}

export class AdapterError extends ValtheraError {
	constructor(cause: unknown, context: Record<string, unknown> = {}) {
		super(errorMessage(cause), {
			code: ErrorCodes.ADAPTER_ERROR,
			cause,
			context,
		});
		this.name = "AdapterError";
	}
}

export class AdapterInitError extends ValtheraError {
	constructor(cause: unknown, context: Record<string, unknown> = {}) {
		super(`Adapter init failed: ${errorMessage(cause)}`, {
			code: ErrorCodes.ADAPTER_INIT,
			cause,
			context,
		});
		this.name = "AdapterInitError";
	}
}

export class AdapterCloseError extends ValtheraError {
	constructor(cause: unknown, context: Record<string, unknown> = {}) {
		super(`Adapter close failed: ${errorMessage(cause)}`, {
			code: ErrorCodes.ADAPTER_CLOSE,
			cause,
			context,
		});
		this.name = "AdapterCloseError";
	}
}

export class TransactionError extends ValtheraError {
	constructor(
		message: string,
		opts: {
			cause?: unknown;
			context?: Record<string, unknown>;
			code?: string;
		} = {},
	) {
		super(message, {
			code: opts.code ?? ErrorCodes.TRANSACTION_FAILED,
			cause: opts.cause,
			context: opts.context,
		});
		this.name = "TransactionError";
	}
}

export class RemoteError extends ValtheraError {
	constructor(cause: unknown, context: Record<string, unknown> = {}) {
		super(errorMessage(cause), {
			code: ErrorCodes.REMOTE_ERROR,
			cause,
			context,
		});
		this.name = "RemoteError";
	}
}

function errorMessage(cause: unknown) {
	return cause instanceof Error ? cause.message : String(cause);
}

export function isValtheraError(e: unknown): e is ValtheraError {
	return e instanceof ValtheraError;
}

/**
 * Copy a ValtheraError with merged context; keeps `instanceof` and `cause`
 */
function cloneWithContext(
	err: ValtheraError,
	context: Record<string, unknown>,
): ValtheraError {
	const clone = Object.create(Object.getPrototypeOf(err)) as ValtheraError;
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
export function wrapAdapterError(
	cause: unknown,
	context: Record<string, unknown> = {},
): ValtheraError {
	if (cause instanceof ValtheraError)
		return Object.keys(context).length
			? cloneWithContext(cause, context)
			: cause;
	return new AdapterError(cause, context);
}

/**
 * Rebuild a ValtheraError from a server response; match by `code`, not class.
 */
export function errorFromWire(payload: ValtheraErrorWire): ValtheraError {
	return new ValtheraError(payload.message ?? "Unknown remote error", {
		code: payload.code ?? ErrorCodes.REMOTE_UNKNOWN,
		suggestion: payload.suggestion,
		context: payload.context,
	});
}
