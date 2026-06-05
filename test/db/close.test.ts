import { describe, expect, test } from "bun:test";
import { MemoryAction } from "#db/memory";
import { ValtheraClass } from "#db/valthera";

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
    test("skips close when the action is not initialized", async () => {
        const action = new LifecycleMemoryAction();
        const db = new ValtheraClass({ dbAction: action });

        await db.close();

        expect(action.closeCalls).toBe(0);
        expect(action._inited).toBe(false);
    });

    test("closes once and lets the next operation initialize again", async () => {
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

    test("supports actions that use the default ActionsBase close", async () => {
        const action = new MemoryAction();
        const db = new ValtheraClass({ dbAction: action });

        await db.close();

        expect(action._inited).toBe(false);
    });
});
