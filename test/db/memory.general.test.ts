import { describe, test, expect } from "bun:test";
import { createMemoryValthera, ValtheraMemory } from "#db/memory";
import { Collection } from "#helpers/collection";

describe("createMemoryValthera - general", () => {
    test("1. should create a ValtheraMemory instance without initial data", () => {
        const db = createMemoryValthera();

        expect(db).toBeInstanceOf(ValtheraMemory);
    });

    test("2. should create a ValtheraMemory instance with initial data", () => {
        const initialData = {
            users: [
                { _id: "1", name: "John", email: "john@example.com" },
                { _id: "2", name: "Jane", email: "jane@example.com" }
            ],
            posts: [
                { _id: "1", title: "First Post", content: "Content 1" }
            ]
        };
        const db = createMemoryValthera(initialData);

        expect(db).toBeInstanceOf(ValtheraMemory);
    });

    test("3. should provide access to collections from initial data", async () => {
        const initialData = {
            users: [
                { _id: "1", name: "John", email: "john@example.com" },
                { _id: "2", name: "Jane", email: "jane@example.com" }
            ]
        };
        const db = createMemoryValthera(initialData);

        const results = await db.users.find();

        expect(results).toHaveLength(2);
        expect(results[0].name).toBe("John");
        expect(results[1].name).toBe("Jane");
    });

    test("4. should allow adding new data to a collection from initial data", async () => {
        const initialData = {
            users: [
                { _id: "1", name: "John", email: "john@example.com" }
            ]
        };
        const db = createMemoryValthera(initialData);

        const newUser = await db.users.add({ name: "Bob", email: "bob@example.com" });

        expect(newUser).toHaveProperty("_id");
        expect(newUser.name).toBe("Bob");

        const allUsers = await db.users.find();
        expect(allUsers).toHaveLength(2);
    });

    test("5. should allow finding data in a collection from initial data", async () => {
        const initialData = {
            users: [
                { _id: "1", name: "John", email: "john@example.com" },
                { _id: "2", name: "Jane", email: "jane@example.com" }
            ]
        };
        const db = createMemoryValthera(initialData);

        const result = await db.users.findOne({ name: "Jane" });

        expect(result).toBeDefined();
        expect(result?.email).toBe("jane@example.com");
    });

    test("6. should allow updating data in a collection from initial data", async () => {
        const initialData = {
            users: [
                { _id: "1", name: "John", email: "john@example.com", age: 25 }
            ]
        };
        const db = createMemoryValthera(initialData);

        const results = await db.users.update({ _id: "1" }, { age: 30 });

        expect(results).toHaveLength(1);
        expect(results[0].age).toBe(30);
    });

    test("7. should allow removing data from a collection from initial data", async () => {
        const initialData = {
            users: [
                { _id: "1", name: "John", email: "john@example.com" },
                { _id: "2", name: "Jane", email: "jane@example.com" }
            ]
        };
        const db = createMemoryValthera(initialData);

        const results = await db.users.remove({ name: "John" });

        expect(results).toHaveLength(1);
        expect(results[0].name).toBe("John");

        const remaining = await db.users.find();
        expect(remaining).toHaveLength(1);
        expect(remaining[0].name).toBe("Jane");
    });

    test("8. should create empty collections when accessed dynamically", () => {
        const db = createMemoryValthera();
        const productsCollection = db.products as Collection<{ _id: string; name: string }>;

        expect(productsCollection).toBeInstanceOf(Collection);
        expect(productsCollection.collection).toBe("products");
    });

    test("9. should handle multiple collections in initial data", async () => {
        const initialData = {
            users: [
                { _id: "1", name: "John" }
            ],
            posts: [
                { _id: "1", title: "First Post" }
            ],
            comments: [
                { _id: "1", text: "First Comment" }
            ]
        };
        const db = createMemoryValthera(initialData);
        const usersCollection = db.users;
        const postsCollection = db.posts;
        const commentsCollection = db.comments;

        const users = await usersCollection.find();
        const posts = await postsCollection.find();
        const comments = await commentsCollection.find();

        expect(users).toHaveLength(1);
        expect(posts).toHaveLength(1);
        expect(comments).toHaveLength(1);

        expect(users[0].name).toBe("John");
        expect(posts[0].title).toBe("First Post");
        expect(comments[0].text).toBe("First Comment");
    });

    test("10. should allow adding to a new collection not in initial data", async () => {
        const initialData = {
            users: [
                { _id: "1", name: "John" }
            ]
        };
        const db = createMemoryValthera(initialData);
        const productsCollection = (db as any).products as Collection<{ _id: string; name: string }>;

        const newProduct = await productsCollection.add({ name: "Product 1" });

        expect(newProduct).toHaveProperty("_id");
        expect(newProduct.name).toBe("Product 1");

        const allProducts = await productsCollection.find();
        expect(allProducts).toHaveLength(1);
    });
});
