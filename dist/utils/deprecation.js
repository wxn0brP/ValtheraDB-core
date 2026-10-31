const warned = new Set();
export function warnDeprecated(code, message) {
    if (warned.has(code))
        return;
    warned.add(code);
    const proc = globalThis.process;
    if (typeof proc?.emitWarning === "function") {
        proc.emitWarning(message, {
            type: "DeprecationWarning",
            code,
        });
        return;
    }
    console.warn(message);
}
