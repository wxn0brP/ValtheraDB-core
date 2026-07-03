import { MemoryAction } from "#db/memory";
import { ValtheraClass } from "#db/valthera";
import { describe, expect, test } from "bun:test";

class LifecycleMemoryAction extends MemoryAction {
    initCalls = 0;
    closeCalls = 0;

    constructor() {
        super();
        this._inited = false;
    }

    async init() {
        this.initCalls++;
    }

    async close() {
        this.closeCalls++;
    }
}

describe("ValtheraClass.close", () => {
    test("1. should skip close when the action is not initialized", async () => {
        const action = new LifecycleMemoryAction();
        const db = new ValtheraClass({ dbAction: action });

        await db.close();

        expect(action.closeCalls).toBe(0);
        expect(action._inited).toBe(false);
    });

    test("2. should close once and let the next operation initialize again", async () => {
        const action = new LifecycleMemoryAction();
        const db = new ValtheraClass({ dbAction: action });

        await db.find({ collection: "users" });
        await db.close();
        await db.close();
        await db.find({ collection: "users" });

        expect(action.initCalls).toBe(2);
        expect(action.closeCalls).toBe(1);
        expect(action._inited).toBe(true);
    });

    test("3. should support actions that use the default ActionsBase close", async () => {
        const action = new MemoryAction();
        const db = new ValtheraClass({ dbAction: action });

        await db.close();

        expect(action._inited).toBe(false);
    });
});
