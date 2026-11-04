import { MemoryAdapter } from "../adapters/memoryAdapter";
import { forgeTypedValthera } from "../helpers/forge";
import { Data } from "../types/data";
import { TypedValthera } from "../types/typed";
import { ValtheraClass } from "./valthera";

export {
	/** @deprecated Use MemoryAdapter. */
	MemoryAction,
	MemoryAdapter,
} from "../adapters/memoryAdapter";

export class ValtheraMemory extends ValtheraClass {
	constructor(...args: any[]) {
		super({
			adapter: new MemoryAdapter(),
		});
	}
}

export function createMemoryValthera<T extends Record<string, Data[]>>(
	data?: T,
): TypedValthera<T, ValtheraMemory> {
	const db = new ValtheraMemory();
	if (!data) return forgeTypedValthera(db) as any;

	for (const collection of Object.keys(data)) {
		(db.adapter as MemoryAdapter).memory.set(collection, data[collection]);
	}

	return forgeTypedValthera(db) as any;
}
