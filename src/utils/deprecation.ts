const warned = new Set<string>();

export function warnDeprecated(code: string, message: string) {
	if (warned.has(code)) return;
	warned.add(code);
	const proc = (globalThis as any).process;
	if (typeof proc?.emitWarning === "function") {
		proc.emitWarning(message, {
			type: "DeprecationWarning",
			code,
		});
		return;
	}
	console.warn(message);
}
