import { describe, test, expect } from "bun:test";
import { createMemoryValthera } from "#db/memory";

describe("createMemoryValthera - collection operations", () => {
    test("11. should allow updateOne to update a single document", async () => {
        const initialData = {
            users: [
                { _id: "1", name: "John", email: "john@example.com", age: 25 },
                { _id: "2", name: "Jane", email: "jane@example.com", age: 30 }
            ]
        };
        const db = createMemoryValthera(initialData);

        const result = await db.users.updateOne({ name: "John" }, { age: 35 });

        expect(result).toBeDefined();
        expect(result?.age).toBe(35);
        expect(result?.name).toBe("John");

        const john = await db.users.findOne({ name: "John" });
        expect(john?.age).toBe(35);

        const jane = await db.users.findOne({ name: "Jane" });
        expect(jane?.age).toBe(30);
    });

    test("12. should return null from updateOne when no document matches", async () => {
        const initialData = {
            users: [
                { _id: "1", name: "John", email: "john@example.com" }
            ]
        };
        const db = createMemoryValthera(initialData);

        const result = await db.users.updateOne({ name: "NonExistent" }, { age: 30 });

        expect(result).toBeNull();
    });

    test("13. should allow removeOne to remove a single document", async () => {
        const initialData = {
            users: [
                { _id: "1", name: "John", email: "john@example.com" },
                { _id: "2", name: "Jane", email: "jane@example.com" },
                { _id: "3", name: "Bob", email: "bob@example.com" }
            ]
        };
        const db = createMemoryValthera(initialData);

        const result = await db.users.removeOne({ name: "Jane" });

        expect(result).toBeDefined();
        expect(result?.name).toBe("Jane");

        const allUsers = await db.users.find();
        expect(allUsers).toHaveLength(2);
        expect(allUsers.some(u => u.name === "Jane")).toBe(false);
    });

    test("14. should return null from removeOne when no document matches", async () => {
        const initialData = {
            users: [
                { _id: "1", name: "John", email: "john@example.com" }
            ]
        };
        const db = createMemoryValthera(initialData);

        const result = await db.users.removeOne({ name: "NonExistent" });

        expect(result).toBeNull();

        const allUsers = await db.users.find();
        expect(allUsers).toHaveLength(1);
    });

    test("15. should updateOneOrAdd update existing document", async () => {
        const initialData = {
            users: [
                { _id: "1", name: "John", email: "john@example.com", age: 25 }
            ]
        };
        const db = createMemoryValthera(initialData);

        const result = await db.users.updateOneOrAdd({ name: "John" }, { age: 30 });

        expect(result.type).toBe("updated");
        expect(result.data).toEqual(expect.objectContaining({ _id: "1", name: "John", age: 30 }));
    });

    test("16. should updateOneOrAdd add new document when not found", async () => {
        const db = createMemoryValthera();

        const result = await db.users.updateOneOrAdd({ name: "John" }, { age: 25 });

        expect(result.type).toBe("added");
        expect(result.data).toEqual(expect.objectContaining({ name: "John", age: 25 }));
        expect(result.data._id).toBeDefined();

        const allUsers = await db.users.find();
        expect(allUsers).toHaveLength(1);
        expect(allUsers[0].name).toBe("John");
        expect(allUsers[0].age).toBe(25);
    });

    test("17. should toggleOne remove existing document", async () => {
        const initialData = {
            users: [
                { _id: "1", name: "John", email: "john@example.com" }
            ]
        };
        const db = createMemoryValthera(initialData);

        const result = await db.users.toggleOne({ name: "John" }, {});

        expect(result.type).toBe("removed");
        expect(result.data).toEqual(expect.objectContaining({ _id: "1", name: "John" }));

        const allUsers = await db.users.find();
        expect(allUsers).toHaveLength(0);
    });

    test("18. should toggleOne add new document when not found", async () => {
        const db = createMemoryValthera();

        const result = await db.users.toggleOne({ name: "John" }, { email: "john@example.com" });

        expect(result.type).toBe("added");
        expect(result.data).toEqual(expect.objectContaining({ name: "John", email: "john@example.com" }));
        expect(result.data._id).toBeDefined();

        const allUsers = await db.users.find();
        expect(allUsers).toHaveLength(1);
        expect(allUsers[0].name).toBe("John");
        expect(allUsers[0].email).toBe("john@example.com");
    });
});
