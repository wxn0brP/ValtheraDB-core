import { describe, test, expect } from "bun:test";
import { updateFindObject } from "#utils/updateFindObject";
import { FindOpts } from "#types/options";

describe("updateFindObject", () => {
    test("1. should return the object unchanged if no find options are provided", () => {
        const obj = { a: 1, b: 2, c: 3 };
        const findOpts: FindOpts = {};
        const result = updateFindObject(obj, findOpts);

        expect(result).toBe(obj); // Same reference since no changes
        expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    test("2. should apply transform function if provided", () => {
        const obj = { a: 1, b: 2 };
        const findOpts: FindOpts = {
            transform: (o: any) => ({ ...o, transformed: true })
        };
        const result = updateFindObject(obj, findOpts);

        expect(result).toEqual({ a: 1, b: 2, transformed: true });
    });

    test("3. should exclude specified fields", () => {
        const obj = { a: 1, b: 2, c: 3, d: 4 };
        const findOpts: FindOpts = {
            exclude: ["b", "d"]
        };
        const result = updateFindObject(obj, findOpts);

        expect(result).toEqual({ a: 1, c: 3 });
    });

    test("4. should select specified fields", () => {
        const obj = { a: 1, b: 2, c: 3, d: 4 };
        const findOpts: FindOpts = {
            select: ["a", "c"]
        };
        const result = updateFindObject(obj, findOpts);

        expect(result).toEqual({ a: 1, c: 3 });
    });

    test("5. should handle non-existent fields in exclude", () => {
        const obj = { a: 1, b: 2 };
        const findOpts: FindOpts = {
            exclude: ["c", "d"]  // fields that don't exist
        };
        const result = updateFindObject(obj, findOpts);

        expect(result).toEqual({ a: 1, b: 2 }); // unchanged
    });

    test("6. should handle non-existent fields in select", () => {
        const obj = { a: 1, b: 2 };
        const findOpts: FindOpts = {
            select: ["a", "c"]  // "c" doesn't exist
        };
        const result = updateFindObject(obj, findOpts);

        expect(result).toEqual({ a: 1 }); // only "a" is selected
    });

    test("7. should apply transform, then exclude, then select in that order", () => {
        const obj = { a: 1, b: 2, c: 3 };
        const findOpts: FindOpts = {
            transform: (o: any) => ({ ...o, d: 4, e: 5 }),
            exclude: ["b", "e"],
            select: ["a", "c", "d"]  // should include a, c, d but not b, e
        };
        const result = updateFindObject(obj, findOpts);

        expect(result).toEqual({ a: 1, c: 3, d: 4 });
    });

    test("8. should handle when findOpts is not a proper object (with destructuring)", () => {
        expect(() => {
            updateFindObject({ a: 1 }, null);
        }).toThrow();

        expect(() => {
            updateFindObject({ a: 1 }, undefined);
        }).toThrow();
    });

    test("9. should handle empty select array", () => {
        const obj = { a: 1, b: 2, c: 3 };
        const findOpts: FindOpts = {
            select: []
        };
        const result = updateFindObject(obj, findOpts);

        expect(result).toEqual({});
    });

    test("10. should handle empty exclude array", () => {
        const obj = { a: 1, b: 2, c: 3 };
        const findOpts: FindOpts = {
            exclude: []
        };
        const result = updateFindObject(obj, findOpts);

        expect(result).toEqual({ a: 1, b: 2, c: 3 }); // unchanged
    });

    test("11. should handle both select and exclude (select takes precedence)", () => {
        const obj = { a: 1, b: 2, c: 3, d: 4 };
        const findOpts: FindOpts = {
            select: ["a", "b", "c"],
            exclude: ["b"]  // b should be excluded even though it's in select
        };
        const result = updateFindObject(obj, findOpts);

        // First, select a, b, c -> { a: 1, b: 2, c: 3 }
        // Then, exclude b -> { a: 1, c: 3 }
        expect(result).toEqual({ a: 1, c: 3 });
    });

    test("12. should work with nested objects", () => {
        const obj = {
            a: 1,
            nested: { x: 10, y: 20 },
            b: 2
        };
        const findOpts: FindOpts = {
            select: ["a", "nested"]
        };
        const result = updateFindObject(obj, findOpts);

        expect(result).toEqual({
            a: 1,
            nested: { x: 10, y: 20 }
        });
    });
});