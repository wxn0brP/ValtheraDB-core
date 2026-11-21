import { MemoryAdapter } from "../adapters/memoryAdapter.js";
import { forgeTypedValthera } from "../helpers/forge.js";
import { ValtheraClass } from "./valthera.js";
export { 
/** @deprecated Use MemoryAdapter. */
MemoryAction, MemoryAdapter, } from "../adapters/memoryAdapter.js";
export class ValtheraMemory extends ValtheraClass {
    constructor(...args) {
        super({
            adapter: new MemoryAdapter(),
        });
    }
}
export function createMemoryValthera(data) {
    const db = new ValtheraMemory();
    if (!data)
        return forgeTypedValthera(db);
    for (const collection of Object.keys(data)) {
        db.adapter.memory.set(collection, data[collection]);
    }
    return forgeTypedValthera(db);
}
