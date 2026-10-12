import { createMemoryValthera } from "#db/memory";
import { Data } from "#types/data";
import { describe, expect, test } from "bun:test";

describe("createMemoryValthera - db interface", () => {
	test("19. should update a single document via db.updateOne", async () => {
		const initialData = {
			users: [
				{
					_id: "1",
					name: "John",
					email: "john@example.com",
					age: 25,
				},
				{
					_id: "2",
					name: "Jane",
					email: "jane@example.com",
					age: 30,
				},
			],
		};
		const db = createMemoryValthera(initialData);

		const result: Data = await db.updateOne({
			collection: "users",
			search: {
				name: "John",
			},
			updater: {
				age: 35,
			},
		});

		expect(result).toBeDefined();
		expect(result?.age).toBe(35);
		expect(result?.name).toBe("John");
	});

	test("20. should return null from db.updateOne when no document matches", async () => {
		const initialData = {
			users: [
				{
					_id: "1",
					name: "John",
					email: "john@example.com",
				},
			],
		};
		const db = createMemoryValthera(initialData);

		const result = await db.updateOne({
			collection: "users",
			search: {
				name: "NonExistent",
			},
			updater: {
				age: 30,
			},
		});

		expect(result).toBeNull();
	});

	test("21. should remove a single document via db.removeOne", async () => {
		const initialData = {
			users: [
				{
					_id: "1",
					name: "John",
					email: "john@example.com",
				},
				{
					_id: "2",
					name: "Jane",
					email: "jane@example.com",
				},
				{
					_id: "3",
					name: "Bob",
					email: "bob@example.com",
				},
			],
		};
		const db = createMemoryValthera(initialData);

		const result = await db.removeOne({
			collection: "users",
			search: {
				name: "Jane",
			},
		});

		expect(result).toBeDefined();
		expect(result?.name).toBe("Jane");

		const allUsers = await db.find({
			collection: "users",
			search: {},
		});
		expect(allUsers).toHaveLength(2);
	});

	test("22. should return null from db.removeOne when no document matches", async () => {
		const initialData = {
			users: [
				{
					_id: "1",
					name: "John",
					email: "john@example.com",
				},
			],
		};
		const db = createMemoryValthera(initialData);

		const result = await db.removeOne({
			collection: "users",
			search: {
				name: "NonExistent",
			},
		});

		expect(result).toBeNull();
	});

	test("23. should update existing document via db.updateOneOrAdd", async () => {
		const initialData = {
			users: [
				{
					_id: "1",
					name: "John",
					email: "john@example.com",
					age: 25,
				},
			],
		};
		const db = createMemoryValthera(initialData);

		const result = await db.updateOneOrAdd({
			collection: "users",
			search: {
				name: "John",
			},
			updater: {
				age: 30,
			},
		});

		expect(result.type).toBe("updated");
		expect(result.data).toEqual(
			expect.objectContaining({
				_id: "1",
				name: "John",
				age: 30,
			}),
		);
	});

	test("24. should add new document via db.updateOneOrAdd when not found", async () => {
		const db = createMemoryValthera();

		const result = await db.updateOneOrAdd<{
			name: string;
			age: number;
			_id: string;
		}>({
			collection: "users",
			search: {
				name: "John",
			},
			updater: {
				age: 25,
			},
		});

		expect(result.type).toBe("added");
		expect(result.data).toEqual(
			expect.objectContaining({
				name: "John",
				age: 25,
			}),
		);
		expect(result.data._id).toBeDefined();
	});

	test("25. should remove existing document via db.toggleOne", async () => {
		const initialData = {
			users: [
				{
					_id: "1",
					name: "John",
					email: "john@example.com",
				},
			],
		};
		const db = createMemoryValthera(initialData);

		const result = await db.toggleOne({
			collection: "users",
			search: {
				name: "John",
			},
			data: {},
		});

		expect(result.type).toBe("removed");
		expect(result.data).toEqual(
			expect.objectContaining({
				_id: "1",
				name: "John",
			}),
		);
	});

	test("26. should add new document via db.toggleOne when not found", async () => {
		const db = createMemoryValthera();

		const result = await db.toggleOne({
			collection: "users",
			search: {
				name: "John",
			},
			data: {
				email: "john@example.com",
			},
		});

		expect(result.type).toBe("added");
		expect(result.data).toEqual(
			expect.objectContaining({
				name: "John",
				email: "john@example.com",
			}),
		);
	});

	test("27. should db.getCollections return collection names", async () => {
		const initialData = {
			users: [
				{
					_id: "1",
					name: "John",
				},
			],
			posts: [
				{
					_id: "1",
					title: "Post",
				},
			],
		};
		const db = createMemoryValthera(initialData);

		const collections = await db.getCollections();

		expect(collections).toContain("users");
		expect(collections).toContain("posts");
	});

	test("28. should ensureCollection create a new collection and return boolean", async () => {
		const db = createMemoryValthera();

		const result = await db.ensureCollection("products");

		expect(typeof result).toBe("boolean");
		expect(result).toBe(true);

		const collections = await db.getCollections();
		expect(collections).toContain("products");
	});

	test("29. should issetCollection check if collection exists", async () => {
		const initialData = {
			users: [
				{
					_id: "1",
					name: "John",
				},
			],
		};
		const db = createMemoryValthera(initialData);

		const exists = await db.issetCollection("users");
		const notExists = await db.issetCollection("nonexistent");

		expect(typeof exists).toBe("boolean");
		expect(typeof notExists).toBe("boolean");
		expect(exists).toBe(true);
		expect(notExists).toBe(false);
	});

	test("30. should removeCollection remove a collection and return boolean", async () => {
		const initialData = {
			users: [
				{
					_id: "1",
					name: "John",
				},
			],
			posts: [
				{
					_id: "1",
					title: "Post",
				},
			],
		};
		const db = createMemoryValthera(initialData);

		const result = await db.removeCollection("posts");

		expect(typeof result).toBe("boolean");
		expect(result).toBe(true);

		const collections = await db.getCollections();
		expect(collections).not.toContain("posts");
		expect(collections).toContain("users");
	});

	test("31. should bulkAdd multiple documents at once", async () => {
		const db = createMemoryValthera();

		const result = await db.bulkAdd({
			collection: "users",
			datas: [
				{
					name: "Alice",
					age: 25,
				},
				{
					name: "Bob",
					age: 30,
				},
				{
					name: "Charlie",
					age: 35,
				},
			],
		});

		expect(result).toHaveLength(3);
		expect(result[0]).toHaveProperty("_id");
		expect(result[1]).toHaveProperty("_id");
		expect(result[2]).toHaveProperty("_id");
		expect(result[0].name).toBe("Alice");
		expect(result[1].name).toBe("Bob");
		expect(result[2].name).toBe("Charlie");

		const allUsers = await db.find({
			collection: "users",
			search: {},
		});
		expect(allUsers).toHaveLength(3);
	});

	test("32. should count documents with db.count", async () => {
		const db = createMemoryValthera({
			users: [
				{
					_id: "1",
					name: "John",
					age: 25,
				},
				{
					_id: "2",
					name: "Jane",
					age: 30,
				},
				{
					_id: "3",
					name: "Bob",
					age: 25,
				},
			],
		});

		const totalCount = await db.count({
			collection: "users",
			search: {},
		});
		expect(totalCount).toBe(3);

		const filteredCount = await db.count({
			collection: "users",
			search: {
				age: 25,
			},
		});
		expect(filteredCount).toBe(2);

		const noMatchCount = await db.count({
			collection: "users",
			search: {
				age: 99,
			},
		});
		expect(noMatchCount).toBe(0);
	});

	test("33. should createIndex on a collection", async () => {
		const db = createMemoryValthera();

		await db.createIndex("users", [
			"name",
		]);
		await db.createIndex(
			"users",
			[
				"email",
			],
			{
				unique: true,
			},
		);
	});

	test("34. should removeIndex from a collection", async () => {
		const db = createMemoryValthera();

		await db.createIndex("users", [
			"name",
		]);
		await db.removeIndex("users", [
			"name",
		]);
	});
});
