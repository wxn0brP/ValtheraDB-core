import { describe, test, expect } from "bun:test";
import { forgeValthera, forgeTypedValthera } from "#helpers/forge";
import { Collection } from "#helpers/collection";
import { createMemoryValthera } from "#db/memory";

describe("forgeValthera", () => {
    test("1. should create a proxy that returns Collection for unknown properties", () => {
        const db = createMemoryValthera();
        const forgedDb = forgeValthera(db);

        const usersCollection = forgedDb.users;

        expect(usersCollection).toBeInstanceOf(Collection);
        expect(usersCollection.collection).toBe("users");
        expect(usersCollection.db).toBe(db);
    });

    test("2. should allow access to existing properties on the target", () => {
        const db = createMemoryValthera();
        const forgedDb = forgeValthera(db);

        // Check if we can access methods from the original db
        expect(typeof forgedDb.add).toBe("function");
        expect(typeof forgedDb.find).toBe("function");
        expect(typeof forgedDb.findOne).toBe("function");
    });

    test("3. should create different collections for different properties", () => {
        const db = createMemoryValthera();
        const forgedDb = forgeValthera<"users" | "posts">(db);

        const usersCollection = forgedDb.users;
        const postsCollection = forgedDb.posts;

        expect(usersCollection).not.toBe(postsCollection);
        expect(usersCollection.collection).toBe("users");
        expect(postsCollection.collection).toBe("posts");
    });

    test("4. should allow setting properties on the forged object", () => {
        const db = createMemoryValthera();
        const forgedDb: any = forgeValthera(db);

        forgedDb.customProperty = "test";
        expect(forgedDb.customProperty).toBe("test");
    });
});

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
            users: { _id: string; name: string };
            posts: { _id: string; title: string };
        }>(db);

        const usersCollection1 = typedForgedDb.users;
        const usersCollection2 = typedForgedDb.users;

        expect(usersCollection1).toBe(usersCollection2);
        expect(usersCollection1.collection).toBe("users");
    });
});