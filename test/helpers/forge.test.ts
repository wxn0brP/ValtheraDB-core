import { createMemoryValthera } from "#db/memory";
import { Collection } from "#helpers/collection";
import { forgeTypedValthera } from "#helpers/forge";
import { describe, expect, test } from "bun:test";

describe("forgeTypedValthera", () => {
	test("1. should work similarly to forgeValthera for basic functionality", () => {
		const db = createMemoryValthera();
		const typedForgedDb = forgeTypedValthera(db);

		const usersCollection = typedForgedDb.users;

		expect(usersCollection).toBeInstanceOf(Collection);
		expect(usersCollection.collection).toBe("users");
		expect(usersCollection.db).toBe(db);
	});

	test("2. should allow access to existing methods", () => {
		const db = createMemoryValthera();
		const typedForgedDb = forgeTypedValthera(db);

		expect(typeof typedForgedDb.add).toBe("function");
		expect(typeof typedForgedDb.find).toBe("function");
	});

	test("3. should create and cache collections", () => {
		const db = createMemoryValthera();
		const typedForgedDb = forgeTypedValthera<{
			users: {
				_id: string;
				name: string;
			};
			posts: {
				_id: string;
				title: string;
			};
		}>(db);

		const usersCollection1 = typedForgedDb.users;
		const usersCollection2 = typedForgedDb.users;

		expect(usersCollection1).toBe(usersCollection2);
		expect(usersCollection1.collection).toBe("users");
	});
});
