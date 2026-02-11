import { describe, test, expect } from "bun:test";
import { Executor } from "#helpers/executor";

describe("Executor", () => {
    test("1. should initialize with empty queue and not executing", () => {
        const executor = new Executor();

        expect(executor.quote).toHaveLength(0);
        expect(executor.isExecuting).toBe(false);
    });

    test("2. should add operations to the queue", async () => {
        const executor = new Executor();

        const result = await executor.addOp((x: number) => x * 2, 5);

        expect(result).toBe(10);
    });

    test("3. should execute operations sequentially", async () => {
        const executor = new Executor();
        const results: number[] = [];

        // Add multiple operations
        const promises = [
            executor.addOp(async (delay: number, value: number) => {
                await new Promise(resolve => setTimeout(resolve, delay));
                results.push(value);
                return value * 2;
            }, 10, 1),
            executor.addOp(async (delay: number, value: number) => {
                await new Promise(resolve => setTimeout(resolve, delay));
                results.push(value);
                return value * 2;
            }, 5, 2),
            executor.addOp(async (delay: number, value: number) => {
                await new Promise(resolve => setTimeout(resolve, delay));
                results.push(value);
                return value * 2;
            }, 1, 3)
        ];

        const allResults = await Promise.all(promises);

        // Operations should execute in sequence, so results should be in order
        expect(results).toEqual([1, 2, 3]);
        expect(allResults).toEqual([2, 4, 6]);
    });
});