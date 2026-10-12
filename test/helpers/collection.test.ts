import { createMemoryValthera } from "#db/memory";
import { Collection } from "#helpers/collection";
import { describe, expect, test } from "bun:test";

describe("Collection", () => {
	test("1. should initialize with db and collection name", () => {
		const db = createMemoryValthera();
		const collection = new Collection(db, "users");

		expect(collection.db).toBe(db);
		expect(collection.collection).toBe("users");
	});

	test("2. should add data to the database", async () => {
		const db = createMemoryValthera();
		const usersCollection = new Collection(db, "users");

		const userData = {
			name: "John Doe",
			email: "john@example.com",
		};
		const result = await usersCollection.add(userData);

		expect(result).toHaveProperty("_id");
		expect(result.name).toBe("John Doe");
		expect(result.email).toBe("john@example.com");
	});

	test("3. should find data in the database", async () => {
		const db = createMemoryValthera({
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
			],
		});
		const usersCollection = new Collection(db, "users");

		const results = await usersCollection.find({
			name: "John",
		});

		expect(results).toHaveLength(1);
		expect(results[0].name).toBe("John");
	});

	test("4. should find one data entry in the database", async () => {
		const db = createMemoryValthera({
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
			],
		});
		const usersCollection = new Collection(db, "users");

		const result = await usersCollection.findOne({
			name: "Jane",
		});

		expect(result).toBeDefined();
		expect(result.name).toBe("Jane");
	});

	test("5. should update data in the database", async () => {
		const db = createMemoryValthera({
			users: [
				{
					_id: "1",
					name: "John",
					email: "john@example.com",
					age: 25,
				},
			],
		});
		const usersCollection = new Collection(db, "users");

		const results = await usersCollection.update(
			{
				_id: "1",
			},
			{
				$set: {
					age: 30,
				},
			},
		);

		expect(results).toHaveLength(1);
		expect(results[0].age).toBe(30);
	});

	test("6. should update one data entry in the database", async () => {
		const db = createMemoryValthera({
			users: [
				{
					_id: "1",
					name: "John",
					email: "john@example.com",
					age: 25,
				},
			],
		});
		const usersCollection = new Collection(db, "users");

		const result = await usersCollection.updateOne(
			{
				_id: "1",
			},
			{
				$set: {
					age: 30,
				},
			},
		);

		expect(result).toBeDefined();
		expect(result.age).toBe(30);
	});

	test("7. should remove data from the database", async () => {
		const db = createMemoryValthera({
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
			],
		});
		const usersCollection = new Collection(db, "users");

		const results = await usersCollection.remove({
			name: "John",
		});

		expect(results).toHaveLength(1);
		expect(results[0].name).toBe("John");

		// Verify the data was actually removed
		const remaining = await usersCollection.find();
		expect(remaining).toHaveLength(1);
		expect(remaining[0].name).toBe("Jane");
	});

	test("8. should remove one data entry from the database", async () => {
		const db = createMemoryValthera({
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
			],
		});
		const usersCollection = new Collection(db, "users");

		const result = await usersCollection.removeOne({
			name: "John",
		});

		expect(result).toBeDefined();
		expect(result.name).toBe("John");

		// Verify only one record was removed
		const remaining = await usersCollection.find();
		expect(remaining).toHaveLength(1);
		expect(remaining[0].name).toBe("Jane");
	});

	test("9. should update one or add data to the database", async () => {
		const db = createMemoryValthera({
			users: [
				{
					_id: "1",
					name: "John",
					email: "john@example.com",
					age: 25,
				},
			],
		});
		const usersCollection = new Collection(db, "users");

		// Update existing
		const updateResult = await usersCollection.updateOneOrAdd(
			{
				name: "John",
			},
			{
				$set: {
					age: 30,
				},
			},
		);
		expect(updateResult).toBeDefined();
		// The updateResult might not directly reflect the update, so we'll check the database
		const updatedUser = await usersCollection.findOne({
			name: "John",
		});
		expect(updatedUser.age).toBe(30);

		// Add new
		const addResult = await usersCollection.updateOneOrAdd(
			{
				name: "Bob",
			},
			{
				$set: {
					age: 25,
				},
			},
			{
				add_arg: {
					email: "bob@example.com",
				},
			},
		);
		expect(addResult).toBeDefined();
		const newUser = await usersCollection.findOne({
			name: "Bob",
		});
		expect(newUser.name).toBe("Bob");
		expect(newUser.age).toBe(25);
		expect(newUser.email).toBe("bob@example.com");
	});

	test("10. should toggle one data entry in the database", async () => {
		// First, test toggling an existing record (which should remove it)
		const db = createMemoryValthera({
			users: [
				{
					_id: "1",
					name: "John",
					email: "john@example.com",
				},
			],
		});
		const usersCollection = new Collection(db, "users");

		// Toggle to remove the record
		const result1 = await usersCollection.toggleOne(
			{
				name: "John",
			},
			{},
		);
		// The toggleOne method returns the result of removeOne (the removed record or null)
		expect(result1).toBeDefined(); // removeOne succeeded and returned the record

		// Verify the record was removed
		const userAfterRemove = await usersCollection.findOne({
			name: "John",
		});
		expect(userAfterRemove).toBeNull();

		// Toggle again to add the record back
		const result2 = await usersCollection.toggleOne(
			{
				name: "John",
			},
			{
				active: true,
			},
		);
		// When no record is found to remove, toggleOne adds a new record and returns it
		expect(result2).toBeDefined(); // add succeeded and returned the new record

		// Verify the record was added back
		const userAfterAdd = await usersCollection.findOne({
			name: "John",
		});
		expect(userAfterAdd).toBeDefined();
		expect(userAfterAdd.name).toBe("John");
		expect(userAfterAdd.active).toBe(true);
	});

	test("11. should bulk add data to the database", async () => {
		const db = createMemoryValthera();
		const usersCollection = new Collection(db, "users");

		const result = await usersCollection.bulkAdd([
			{
				name: "Alice",
				email: "alice@example.com",
			},
			{
				name: "Bob",
				email: "bob@example.com",
			},
			{
				name: "Charlie",
				email: "charlie@example.com",
			},
		]);

		expect(result).toHaveLength(3);
		expect(result[0]).toHaveProperty("_id");
		expect(result[1]).toHaveProperty("_id");
		expect(result[2]).toHaveProperty("_id");
		expect(result[0].name).toBe("Alice");
		expect(result[1].name).toBe("Bob");
		expect(result[2].name).toBe("Charlie");

		const allUsers = await usersCollection.find();
		expect(allUsers).toHaveLength(3);
	});

	test("12. should count documents in the collection", async () => {
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
		const usersCollection = new Collection(db, "users");

		const totalCount = await usersCollection.count();
		expect(totalCount).toBe(3);

		const filteredCount = await usersCollection.count({
			age: 25,
		});
		expect(filteredCount).toBe(2);

		const noMatchCount = await usersCollection.count({
			age: 99,
		});
		expect(noMatchCount).toBe(0);
	});

	test("13. should create an index on the collection", async () => {
		const db = createMemoryValthera();
		const usersCollection = new Collection(db, "users");

		await usersCollection.createIndex([
			"name",
		]);
		await usersCollection.createIndex(
			[
				"email",
			],
			{
				unique: true,
			},
		);
	});

	test("14. should remove an index from the collection", async () => {
		const db = createMemoryValthera();
		const usersCollection = new Collection(db, "users");

		await usersCollection.createIndex([
			"name",
		]);
		await usersCollection.removeIndex([
			"name",
		]);
	});
});
