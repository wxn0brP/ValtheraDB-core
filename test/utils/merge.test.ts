import { describe, test, expect } from "bun:test";
import { deepMerge } from "#utils/merge";

describe("deepMerge", () => {
    test("1. should merge two simple objects", () => {
        const target = { a: 1, b: 2 };
        const source = { c: 3, d: 4 };
        const result = deepMerge(target, source);

        expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
        expect(result).not.toBe(target); // Should return a new object
    });

    test("2. should override properties in target with source values", () => {
        const target = { a: 1, b: 2, c: "old" };
        const source = { c: "new", d: 4 };
        const result = deepMerge(target, source);

        expect(result).toEqual({ a: 1, b: 2, c: "new", d: 4 });
    });

    test("3. should deep merge nested objects", () => {
        const target = { a: { x: 1, y: 2 }, b: 3 };
        const source = { a: { y: 20, z: 30 }, c: 4 };
        const result = deepMerge(target, source);

        expect(result).toEqual({
            a: { x: 1, y: 20, z: 30 },
            b: 3,
            c: 4
        });
    });

    test("4. should not deep merge arrays (replace instead)", () => {
        const target = { a: [1, 2, 3] };
        const source = { a: [4, 5] };
        const result = deepMerge(target, source);

        expect(result).toEqual({ a: [4, 5] });
    });

    test("5. should deep merge nested objects within arrays properly (but array itself is replaced)", () => {
        const target = {
            arr: [{ id: 1, name: "first" }, { id: 2, name: "second" }]
        };
        const source = {
            arr: [{ id: 1, value: "updated" }, { id: 3, name: "third" }]
        };
        const result = deepMerge(target, source);

        // The entire array is replaced, not merged
        expect(result).toEqual({
            arr: [{ id: 1, value: "updated" }, { id: 3, name: "third" }]
        });
    });

    test("6. should handle target object with nested properties", () => {
        const target = {
            user: {
                name: "John",
                details: {
                    age: 30,
                    address: {
                        city: "New York"
                    }
                }
            }
        };

        const source = {
            user: {
                details: {
                    address: {
                        country: "USA"
                    },
                    email: "john@example.com"
                }
            }
        };

        const result = deepMerge(target, source);

        expect(result).toEqual({
            user: {
                name: "John",
                details: {
                    age: 30,
                    address: {
                        city: "New York",
                        country: "USA"
                    },
                    email: "john@example.com"
                }
            }
        });
    });

    test("7. should handle null or non-object values", () => {
        const target = { a: 1 };
        const source = null;
        const result = deepMerge(target, source);

        expect(result).toEqual({ a: 1 }); // target unchanged

        // Test with target as null
        const result2 = deepMerge(null, { b: 2 });
        expect(result2).toEqual({ b: 2 });
    });

    test("8. should handle source with primitive values", () => {
        const target = { a: { x: 1 } };
        const source = { a: "replaced" };  // replacing object with string
        const result = deepMerge(target, source);

        expect(result).toEqual({ a: "replaced" });
    });

    test("9. should handle empty objects", () => {
        expect(deepMerge({}, {})).toEqual({});
        expect(deepMerge({ a: 1 }, {})).toEqual({ a: 1 });
        expect(deepMerge({}, { b: 2 })).toEqual({ b: 2 });
    });

    test("10. should not merge array properties", () => {
        const target = { arr: [1, 2, 3] };
        const source = { arr: [4, 5] };
        const result = deepMerge(target, source);

        // The entire array is replaced, not merged or deep merged
        expect(result).toEqual({ arr: [4, 5] });
    });

    test("11. should preserve original objects", () => {
        const target = { a: { x: 1 }, b: [1, 2] };
        const source = { a: { y: 2 }, b: [3, 4] };

        const targetCopy = JSON.parse(JSON.stringify(target));
        const sourceCopy = JSON.parse(JSON.stringify(source));

        const result = deepMerge(target, source);

        // Original objects should be unchanged
        expect(target).toEqual(targetCopy);
        expect(source).toEqual(sourceCopy);

        // Result should be a new object with merged properties
        expect(result).toEqual({ a: { x: 1, y: 2 }, b: [3, 4] });
    });
});