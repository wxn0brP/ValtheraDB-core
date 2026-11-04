import { MemoryAdapter } from "#adapters/memoryAdapter";
import { ValtheraClass } from "#db/valthera";
import { describe, expect, test } from "bun:test";

class LifecycleMemoryAdapter extends MemoryAdapter {
	initCalls = 0;
	closeCalls = 0;

	constructor() {
		super();
		this._inited = false;
	}

	async init() {
		this.initCalls++;
	}

	async close() {
		this.closeCalls++;
	}
}

describe("ValtheraClass.close", () => {
	test("1. should skip close when the adapter is not initialized", async () => {
		const adapter = new LifecycleMemoryAdapter();
		const db = new ValtheraClass({
			adapter: adapter,
		});

		await db.close();

		expect(adapter.closeCalls).toBe(0);
		expect(adapter._inited).toBe(false);
	});

	test("2. should close once and let the next operation initialize again", async () => {
		const adapter = new LifecycleMemoryAdapter();
		const db = new ValtheraClass({
			adapter: adapter,
		});

		await db.find({
			collection: "users",
		});
		await db.close();
		await db.close();
		await db.find({
			collection: "users",
		});

		expect(adapter.initCalls).toBe(2);
		expect(adapter.closeCalls).toBe(1);
		expect(adapter._inited).toBe(true);
	});

	test("3. should support adapters that use the default AdapterBase close", async () => {
		const adapter = new MemoryAdapter();
		const db = new ValtheraClass({
			adapter: adapter,
		});

		await db.close();

		expect(adapter._inited).toBe(false);
	});
});
