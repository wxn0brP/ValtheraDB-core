import { MemoryAction } from "#db/memory";
import { addId } from "#helpers/addId";
import { describe, expect, test } from "bun:test";

describe("addId", () => {
    test("1. should add a generated ID when id_gen is true and data has no _id", async () => {
        const db = new MemoryAction();
        const query: any = { collection: "test", data: { name: "test" } };

        await addId(query, db, true);

        expect(query.data._id).toBeDefined();
        expect(query.data._id).not.toBeUndefined();
    });

    test("2. should not add ID when id_gen is false", async () => {
        const db = new MemoryAction();
        const query: any = { collection: "test", data: { name: "test" }, id_gen: false };

        await addId(query, db, true);

        expect(query.data._id).toBeUndefined();
    });

    test("3. should not add ID when data already has _id", async () => {
        const db = new MemoryAction();
        const query = { collection: "test", data: { _id: "existing-id", name: "test" } };

        await addId(query, db, true);

        expect(query.data._id).toBe("existing-id");
    });

    test("4. should use number ID when numberId is enabled", async () => {
        const db = new MemoryAction();
        db.numberId = true;

        const query: any = { collection: "test", data: { name: "test" } };

        await addId(query, db, true);

        expect(query.data._id).toBe(1);
    });

    test("5. should increment number ID correctly", async () => {
        const db = new MemoryAction();
        db.numberId = true;

        const query1: any = { collection: "test", data: { name: "test1" } };
        const query2: any = { collection: "test", data: { name: "test2" } };

        await addId(query1, db, true);
        await addId(query2, db, true);

        expect(query1.data._id).toBe(1);
        expect(query2.data._id).toBe(2);
    });
});