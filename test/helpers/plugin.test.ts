import { createMemoryValthera } from "#db/memory";
import { describe, expect, test } from "bun:test";

describe("ValtheraClass.plugin", () => {
    test("1. should return unsubscribe function", () => {
        const db = createMemoryValthera();
        const unsub = db.plugin({
            name: "test",
            execute(ctx) { return ctx.next() },
        });
        expect(typeof unsub).toBe("function");
    });

    test("2. should run plugin execute on operation", async () => {
        const db = createMemoryValthera();
        let called = false;
        db.plugin({
            name: "test",
            execute(ctx) { called = true; return ctx.next() },
        });
        await db.add({ collection: "users", data: { name: "John" } });
        expect(called).toBe(true);
    });

    test("3. unsubscribe should remove plugin", async () => {
        const db = createMemoryValthera();
        let count = 0;
        const unsub = db.plugin({
            name: "test",
            execute(ctx) { count++; return ctx.next() },
        });
        unsub();
        await db.add({ collection: "users", data: { name: "John" } });
        expect(count).toBe(0);
    });

    test("4. should receive op and query via ctx", async () => {
        const db = createMemoryValthera();
        let captured: any;
        db.plugin({
            name: "test",
            execute(ctx) {
                captured = { op: ctx.op, query: ctx.query };
                return ctx.next();
            },
        });
        await db.add({ collection: "users", data: { name: "John" } });
        expect(captured.op).toBe("add");
        expect(captured.query.collection).toBe("users");
    });

    test("5. next() calls adapter when no more plugins", async () => {
        const db = createMemoryValthera({
            users: [{ _id: "1", name: "John" }],
        });
        let adapterReached = false;
        db.plugin({
            name: "test",
            async execute(ctx) {
                const result = await ctx.next();
                adapterReached = true;
                return result;
            },
        });
        const results = await db.find({ collection: "users" });
        expect(adapterReached).toBe(true);
        expect(results).toHaveLength(1);
    });

    test("6. can modify query via ctx.query", async () => {
        const db = createMemoryValthera({
            users: [{ _id: "1", name: "John", tenant: "default" }],
        });
        db.plugin({
            name: "tenant",
            execute(ctx) {
                ctx.query = {
                    ...ctx.query,
                    search: { ...ctx.query.search, tenant: "default" },
                };
                return ctx.next();
            },
        });
        const result: any = await db.findOne({
            collection: "users",
            search: { _id: "1" },
        });
        expect(result.name).toBe("John");
    });

    test("7. can modify result after adapter", async () => {
        const db = createMemoryValthera({
            users: [{ _id: "1", name: "John" }],
        });
        db.plugin({
            name: "transform",
            async execute(ctx) {
                const result = await ctx.next();
                return result.map((doc: any) => ({ ...doc, _tagged: true }));
            },
        });
        const [doc] = await db.find({ collection: "users" });
        expect(doc._tagged).toBe(true);
        expect(doc.name).toBe("John");
    });

    test("8. can skip adapter by returning without next()", async () => {
        let adapterCalled = false;
        const db = createMemoryValthera();

        const origAdd = db.adapter.add.bind(db.adapter);
        db.adapter.add = async (config: any) => {
            adapterCalled = true;
            return origAdd(config);
        };

        db.plugin({
            name: "cache",
            async execute(_ctx) {
                return { fromCache: true, name: "John" };
            },
        });

        const result: any = await db.add({
            collection: "users",
            data: { name: "John" },
        });
        expect(adapterCalled).toBe(false);
        expect(result.fromCache).toBe(true);
    });

    test("9. should run plugins in FIFO order", async () => {
        const db = createMemoryValthera();
        const order: string[] = [];
        db.plugin({
            name: "a",
            execute(ctx) {
                order.push("a");
                return ctx.next();
            },
        });
        db.plugin({
            name: "b",
            execute(ctx) {
                order.push("b");
                return ctx.next();
            },
        });
        await db.add({ collection: "users", data: { name: "John" } });
        expect(order).toEqual(["a", "b"]);
    });

    test("10. result flows back in LIFO order", async () => {
        const db = createMemoryValthera();
        const order: string[] = [];
        db.plugin({
            name: "a",
            async execute(ctx) {
                const r = await ctx.next();
                order.push("a:after");
                return r;
            },
        });
        db.plugin({
            name: "b",
            async execute(ctx) {
                const r = await ctx.next();
                order.push("b:after");
                return r;
            },
        });
        await db.add({ collection: "users", data: { name: "John" } });
        expect(order).toEqual(["b:after", "a:after"]);
    });

    test("11. plugin can catch errors from next()", async () => {
        const db = createMemoryValthera();
        let caught: Error | undefined;
        db.plugin({
            name: "test",
            async execute(ctx) {
                try {
                    return await ctx.next();
                } catch (e: any) {
                    caught = e;
                    return { recovered: true };
                }
            },
        });

        db.adapter.find = async () => {
            throw new Error("boom");
        };

        const result: any = await db.find({ collection: "users" });
        expect(caught!.message).toBe("boom");
        expect(result.recovered).toBe(true);
    });

    test("12. emitter fires with final result after plugin chain", async () => {
        const db = createMemoryValthera();
        let emitted: any;
        db.emitter.on("add", (query: any, result: any) => {
            emitted = { query, result };
        });
        db.plugin({
            name: "test",
            async execute(ctx) {
                const r = await ctx.next();
                return { ...r, _tagged: true };
            },
        });
        const result: any = await db.add({
            collection: "users",
            data: { name: "John" },
        });
        expect(emitted.result._tagged).toBe(true);
        expect(result._tagged).toBe(true);
    });

    test("13. works through forgeTypedValthera collections", async () => {
        const db = createMemoryValthera({
            users: [{ _id: "1", name: "John" }],
        });
        let called = false;
        db.plugin({
            name: "test",
            execute(ctx) {
                called = true;
                return ctx.next();
            },
        });
        const results = await db.users.find();
        expect(called).toBe(true);
        expect(results).toHaveLength(1);
    });

    test("14. empty plugins uses fast path", async () => {
        const db = createMemoryValthera({
            users: [{ _id: "1", name: "John" }],
        });
        const result = await db.find({ collection: "users" });
        expect(result).toHaveLength(1);
    });

    test("15. can change operation e.g. remove to update (soft delete)", async () => {
        const db = createMemoryValthera({
            users: [{ _id: "1", name: "John" }],
        });
        db.plugin({
            name: "soft-delete",
            execute(ctx) {
                if (ctx.op === "remove") {
                    ctx.op = "update";
                    ctx.query = {
                        ...ctx.query,
                        updater: { deleted: true },
                    };
                }
                return ctx.next();
            },
        });

        await db.remove({ collection: "users", search: { _id: "1" } });

        const result: any = await db.findOne({
            collection: "users",
            search: { _id: "1" },
        });
        expect(result).not.toBeNull();
        expect(result.deleted).toBe(true);
        expect(result.name).toBe("John");
    });

    test("16. mutation of ctx.op visible to later plugins", async () => {
        const db = createMemoryValthera({
            users: [{ _id: "1", name: "John" }],
        });
        let seenOp: string | undefined;
        db.plugin({
            name: "a",
            execute(ctx) {
                ctx.op = "find";
                ctx.query = { ...ctx.query, search: { _id: "1" } };
                return ctx.next();
            },
        });
        db.plugin({
            name: "b",
            execute(ctx) {
                seenOp = ctx.op;
                return ctx.next();
            },
        });

        await db.remove({ collection: "users", search: { _id: "1" } });

        expect(seenOp).toBe("find");
    });
});
