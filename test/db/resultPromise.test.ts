import { MemoryAdapter } from "#adapters/memoryAdapter";
import { createMemoryValthera } from "#db/memory";
import { ValtheraClass } from "#db/valthera";
import { DataInternal } from "#types/data";
import { describe, expect, test } from "bun:test";

describe("ResultPromise - chained accessors", () => {
	test("1. .type resolves to updated for existing document", async () => {
		const db = createMemoryValthera({
			users: [
				{
					_id: "1",
					name: "John",
					age: 25,
				},
			],
		});

		const type = await db.users.updateOneOrAdd(
			{
				name: "John",
			},
			{
				age: 30,
			},
		).type;

		expect(type).toBe("updated");
	});

	test("2. .type resolves to added for missing document", async () => {
		const db = createMemoryValthera();

		const type = await db.users.updateOneOrAdd(
			{
				name: "John",
			},
			{
				age: 25,
			},
		).type;

		expect(type).toBe("added");
	});

	test("3. .data resolves to the document", async () => {
		const db = createMemoryValthera({
			users: [
				{
					_id: "1",
					name: "John",
					age: 25,
				},
			],
		});

		const data = await db.users.updateOneOrAdd(
			{
				name: "John",
			},
			{
				age: 30,
			},
		).data;

		expect(data).toEqual(
			expect.objectContaining({
				_id: "1",
				name: "John",
				age: 30,
			}),
		);
	});

	test("4. await on the promise still returns the full result object", async () => {
		const db = createMemoryValthera({
			users: [
				{
					_id: "1",
					name: "John",
					age: 25,
				},
			],
		});

		const result = await db.users.updateOneOrAdd(
			{
				name: "John",
			},
			{
				age: 30,
			},
		);

		expect(result.type).toBe("updated");
		expect(result.data).toEqual(
			expect.objectContaining({
				_id: "1",
			}),
		);
	});

	test("5. promise is a real Promise and works with then/all", async () => {
		const db = createMemoryValthera();

		const promise = db.users.updateOneOrAdd(
			{
				name: "John",
			},
			{
				age: 25,
			},
		);

		expect(promise).toBeInstanceOf(Promise);

		const [result, type] = await Promise.all([
			promise,
			promise.type,
		]);
		expect(result.type).toBe("added");
		expect(type).toBe("added");
	});

	test("6. toggleOne chained .type and .data", async () => {
		const db = createMemoryValthera({
			users: [
				{
					_id: "1",
					name: "John",
					age: 25,
				},
			],
		});

		const removedType = await db.users.toggleOne(
			{
				name: "John",
			},
			{
				age: 30,
			},
		).type;
		expect(removedType).toBe("removed");

		const addedData = await db.users.toggleOne(
			{
				name: "John",
			},
			{
				age: 40,
			},
		).data;
		expect(addedData).toEqual(
			expect.objectContaining({
				name: "John",
				age: 40,
			}),
		);

		const addedType = await db.users.toggleOne(
			{
				name: "Nobody",
			},
			{
				age: 1,
			},
		).type;
		expect(addedType).toBe("added");
	});

	test("7. works through db-level updateOneOrAdd and in a transaction", async () => {
		const db = createMemoryValthera();

		const type = await db.updateOneOrAdd({
			collection: "users",
			search: {
				name: "John",
			},
			updater: {
				age: 25,
			},
		}).type;
		expect(type).toBe("added");
	});

	test("8. .type rejects when the operation fails", async () => {
		class FailingAdapter extends MemoryAdapter {
			async updateOne(): Promise<DataInternal> {
				throw new Error("Update failed");
			}
		}
		const db = new ValtheraClass({
			adapter: new FailingAdapter(),
		});
		await db.init();

		const promise = db.updateOneOrAdd({
			collection: "users",
			search: {
				name: "John",
			},
			updater: {
				age: 1,
			},
		});

		await expect(promise.type).rejects.toThrow("Update failed");
		await expect(promise).rejects.toThrow("Update failed");
	});
});
