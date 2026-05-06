import { Executor, SmartExecutor } from "#helpers/executor";
import { VQuery } from "#types/query";
import { describe, expect, test } from "bun:test";

describe("Executor", () => {
    test("1. should initialize with empty queue and not executing", () => {
        const executor = new Executor();
        expect(executor.queue).toHaveLength(0);
        expect(executor.isExecuting).toBe(false);
    });

    test("2. should add single VQuery operation to the queue", async () => {
        const executor = new Executor();
        const mockAdd = async (query: VQuery) => ({ _id: "1", ...query.data });
        const query: VQuery = { collection: "users", data: { name: "John" } };
        const result = await executor.addOp(mockAdd, query);
        expect(result).toEqual({ _id: "1", name: "John" });
    });

    test("3. should execute VQuery operations sequentially", async () => {
        const executor = new Executor();
        const order: string[] = [];
        const mockAdd = async (query: VQuery) => {
            order.push(`add-${query.data?.name}`);
            return { _id: "1", ...query.data };
        };
        const mockFind = async (query: VQuery) => {
            order.push(`find-${query.collection}`);
            return [{ _id: "1", name: "John" }];
        };
        await Promise.all([
            executor.addOp(mockAdd, { collection: "users", data: { name: "Alice" } }),
            executor.addOp(mockFind, { collection: "users" }),
            executor.addOp(mockAdd, { collection: "users", data: { name: "Bob" } }),
        ]);
        expect(order).toEqual(["add-Alice", "find-users", "add-Bob"]);
    });
});

describe("SmartExecutor", () => {
    test("1. should initialize with empty collections", () => {
        const executor = new SmartExecutor();
        expect(executor.collections.size).toBe(0);
    });

    test("2. should create separate executors for different collections", async () => {
        const executor = new SmartExecutor();
        const mockAdd = async (query: VQuery) => ({ _id: "1", ...query.data });
        const result1 = await executor.addOp(mockAdd, { collection: "users", data: { name: "John" } }, "users");
        const result2 = await executor.addOp(mockAdd, { collection: "posts", data: { title: "Hello" } }, "posts");
        expect(result1).toEqual({ _id: "1", name: "John" });
        expect(result2).toEqual({ _id: "1", title: "Hello" });
        expect(executor.collections.size).toBe(2);
    });

    test("3. should execute operations sequentially for the same collection", async () => {
        const executor = new SmartExecutor();
        const order: string[] = [];
        const mockAdd = async (query: VQuery) => {
            order.push(`add-${query.data?.name}`);
            return { _id: "1", ...query.data };
        };
        const mockUpdate = async (query: VQuery) => {
            order.push(`update-${query.collection}`);
            // @ts-expect-error
            return [{ _id: "1", ...query.updater?.({ name: "Updated" }) }];
        };
        await Promise.all([
            executor.addOp(mockAdd, { collection: "users", data: { name: "Alice" } }, "users"),
            executor.addOp(mockUpdate, { collection: "users", search: { name: "Alice" }, updater: (d: any) => ({ ...d, name: "Bob" }) }, "users"),
            executor.addOp(mockAdd, { collection: "users", data: { name: "Charlie" } }, "users"),
        ]);
        expect(order).toEqual(["add-Alice", "update-users", "add-Charlie"]);
    });

    test("4. should allow parallel operations on different collections", async () => {
        const executor = new SmartExecutor();
        const order: string[] = [];
        const mockAdd = async (query: VQuery) => {
            order.push(`add-${query.collection}`);
            return { _id: "1", ...query.data };
        };
        await Promise.all([
            executor.addOp(mockAdd, { collection: "users", data: { name: "John" } }, "users"),
            executor.addOp(mockAdd, { collection: "posts", data: { title: "Post" } }, "posts"),
        ]);
        expect(order).toHaveLength(2);
        expect(executor.collections.size).toBe(2);
    });

    test("5. should use default collection when collection is not specified", async () => {
        const executor = new SmartExecutor();
        const mockFind = async (_query: VQuery) => [];
        // @ts-expect-error
        await executor.addOp(mockFind, { collection: "test" });
        expect(executor.collections.has("__default__")).toBe(true);
    });
});
