import { describe, test, expect } from "bun:test";
import { createMemoryValthera } from "#db/memory";
import { Data } from "#types/data";

describe("createMemoryValthera - db interface", () => {
    test("19. should db.updateOne update a single document", async () => {
        const initialData = {
            users: [
                { _id: "1", name: "John", email: "john@example.com", age: 25 },
                { _id: "2", name: "Jane", email: "jane@example.com", age: 30 }
            ]
        };
        const db = createMemoryValthera(initialData);

        const result: Data = await db.updateOne({
            collection: "users",
            search: { name: "John" },
            updater: { age: 35 }
        });

        expect(result).toBeDefined();
        expect(result?.age).toBe(35);
        expect(result?.name).toBe("John");
    });

    test("20. should db.updateOne return null when no document matches", async () => {
        const initialData = {
            users: [
                { _id: "1", name: "John", email: "john@example.com" }
            ]
        };
        const db = createMemoryValthera(initialData);

        const result = await db.updateOne({
            collection: "users",
            search: { name: "NonExistent" },
            updater: { age: 30 }
        });

        expect(result).toBeNull();
    });

    test("21. should db.removeOne remove a single document", async () => {
        const initialData = {
            users: [
                { _id: "1", name: "John", email: "john@example.com" },
                { _id: "2", name: "Jane", email: "jane@example.com" },
                { _id: "3", name: "Bob", email: "bob@example.com" }
            ]
        };
        const db = createMemoryValthera(initialData);

        const result = await db.removeOne({ collection: "users", search: { name: "Jane" } });

        expect(result).toBeDefined();
        expect(result?.name).toBe("Jane");

        const allUsers = await db.find({ collection: "users", search: {} });
        expect(allUsers).toHaveLength(2);
    });

    test("22. should db.removeOne return null when no document matches", async () => {
        const initialData = {
            users: [
                { _id: "1", name: "John", email: "john@example.com" }
            ]
        };
        const db = createMemoryValthera(initialData);

        const result = await db.removeOne({ collection: "users", search: { name: "NonExistent" } });

        expect(result).toBeNull();
    });

    test("23. should db.updateOneOrAdd update existing document", async () => {
        const initialData = {
            users: [
                { _id: "1", name: "John", email: "john@example.com", age: 25 }
            ]
        };
        const db = createMemoryValthera(initialData);

        const result = await db.updateOneOrAdd({
            collection: "users",
            search: { name: "John" },
            updater: { age: 30 }
        });

        expect(result.type).toBe("updated");
        expect(result.data).toEqual(expect.objectContaining({ _id: "1", name: "John", age: 30 }));
    });

    test("24. should db.updateOneOrAdd add new document when not found", async () => {
        const db = createMemoryValthera();

        const result = await db.updateOneOrAdd({
            collection: "users",
            search: { name: "John" },
            updater: { age: 25 }
        });

        expect(result.type).toBe("added");
        expect(result.data).toEqual(expect.objectContaining({ name: "John", age: 25 }));
        expect(result.data._id).toBeDefined();
    });

    test("25. should db.toggleOne remove existing document", async () => {
        const initialData = {
            users: [
                { _id: "1", name: "John", email: "john@example.com" }
            ]
        };
        const db = createMemoryValthera(initialData);

        const result = await db.toggleOne({ collection: "users", search: { name: "John" }, data: {} });

        expect(result.type).toBe("removed");
        expect(result.data).toEqual(expect.objectContaining({ _id: "1", name: "John" }));
    });

    test("26. should db.toggleOne add new document when not found", async () => {
        const db = createMemoryValthera();

        const result = await db.toggleOne({
            collection: "users",
            search: { name: "John" },
            data: { email: "john@example.com" }
        });

        expect(result.type).toBe("added");
        expect(result.data).toEqual(expect.objectContaining({ name: "John", email: "john@example.com" }));
    });

    test("27. should db.getCollections return collection names", async () => {
        const initialData = {
            users: [{ _id: "1", name: "John" }],
            posts: [{ _id: "1", title: "Post" }]
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
            users: [{ _id: "1", name: "John" }]
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
            users: [{ _id: "1", name: "John" }],
            posts: [{ _id: "1", title: "Post" }]
        };
        const db = createMemoryValthera(initialData);

        const result = await db.removeCollection("posts");

        expect(typeof result).toBe("boolean");
        expect(result).toBe(true);

        const collections = await db.getCollections();
        expect(collections).not.toContain("posts");
        expect(collections).toContain("users");
    });
});
