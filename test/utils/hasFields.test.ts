import { describe, test, expect } from "bun:test";
import hasFields from "#utils/hasFields";

describe("hasFields", () => {
    test("1. should return true for empty fields", () => {
        expect(hasFields({}, {})).toBe(true);
    });

    test("2. should return true when all fields match", () => {
        const obj = { a: 5, b: 10 };
        expect(hasFields(obj, { a: 5 })).toBe(true);
        expect(hasFields(obj, { a: 5, b: 10 })).toBe(true);
    });

    test("3. should return false when any field doesn't match", () => {
        const obj = { a: 5, b: 10 };
        expect(hasFields(obj, { a: 6 })).toBe(false);
        expect(hasFields(obj, { a: 5, b: 11 })).toBe(false);
        expect(hasFields(obj, { c: 5 })).toBe(false);
    });

    test("4. should return false when object doesn't have required field", () => {
        const obj = { a: 5 };
        expect(hasFields(obj, { b: 5 })).toBe(false);
        expect(hasFields(obj, { a: 5, b: 10 })).toBe(false);
    });

    test("5. should handle different data types correctly", () => {
        const obj = {
            string: "hello",
            number: 42,
            boolean: true,
            nullValue: null
        };

        expect(hasFields(obj, { string: "hello" })).toBe(true);
        expect(hasFields(obj, { number: 42 })).toBe(true);
        expect(hasFields(obj, { boolean: true })).toBe(true);
        expect(hasFields(obj, { nullValue: null })).toBe(true);

        // Negative tests
        expect(hasFields(obj, { string: "world" })).toBe(false);
        expect(hasFields(obj, { number: 41 })).toBe(false);
        expect(hasFields(obj, { boolean: false })).toBe(false);
        expect(hasFields(obj, { nullValue: undefined })).toBe(false);
    });

    test("6. should handle nested objects", () => {
        const obj = {
            a: {
                b: {
                    c: 5
                }
            },
            d: 10
        };

        expect(hasFields(obj, { a: { b: { c: 5 } } })).toBe(true);
        expect(hasFields(obj, { a: { b: { c: 6 } } })).toBe(false);
        expect(hasFields(obj, { a: { b: { c: 5, d: 7 } } })).toBe(false);
        expect(hasFields(obj, { d: 10 })).toBe(true);
    });

    test("7. should return false for nested objects when nested field doesn't match", () => {
        const obj = {
            a: {
                b: 5
            }
        };

        expect(hasFields(obj, { a: { b: 5 } })).toBe(true);
        expect(hasFields(obj, { a: { b: 6 } })).toBe(false);
        expect(hasFields(obj, { a: { c: 5 } })).toBe(false); // c doesn't exist in obj.a
    });

    test("8. should handle arrays as values", () => {
        const obj = {
            arr: [1, 2, 3],
            nested: {
                arr: ["a", "b", "c"]
            }
        };

        expect(hasFields(obj, { arr: [1, 2, 3] })).toBe(true);
        expect(hasFields(obj, { arr: [1, 2, 4] })).toBe(false);
        expect(hasFields(obj, { nested: { arr: ["a", "b", "c"] } })).toBe(true);
        expect(hasFields(obj, { nested: { arr: ["a", "b", "d"] } })).toBe(false);
    });

    test("9. should handle null and undefined values properly", () => {
        const obj = {
            nullField: null,
            zero: 0,
            emptyString: "",
            falseValue: false
        };

        expect(hasFields(obj, { nullField: null })).toBe(true);
        expect(hasFields(obj, { zero: 0 })).toBe(true);
        expect(hasFields(obj, { emptyString: "" })).toBe(true);
        expect(hasFields(obj, { falseValue: false })).toBe(true);

        // Strict equality tests
        expect(hasFields(obj, { nullField: undefined })).toBe(false);
        expect(hasFields(obj, { zero: false })).toBe(false);
        expect(hasFields(obj, { emptyString: false })).toBe(false);
    });

    test("10. should distinguish between objects and primitive values", () => {
        const obj = {
            obj: { value: "test" },
            primitive: 123
        };

        expect(hasFields(obj, { obj: { value: "test" } })).toBe(true);
        expect(hasFields(obj, { primitive: 123 })).toBe(true);
        expect(hasFields(obj, { obj: 123 })).toBe(false);
        expect(hasFields(obj, { primitive: { value: "test" } })).toBe(false);
    });

    test("11. should handle deeply nested structures", () => {
        const obj = {
            level1: {
                level2: {
                    level3: {
                        value: "deep"
                    }
                }
            }
        };

        expect(hasFields(obj, { level1: { level2: { level3: { value: "deep" } } } })).toBe(true);
        expect(hasFields(obj, { level1: { level2: { level3: { value: "shallow" } } } })).toBe(false);
    });

    test("12. should handle objects with same values but different key order", () => {
        const obj = { a: 1, b: 2 };
        // The function only checks if the field values match, not the ordering
        expect(hasFields(obj, { b: 2, a: 1 })).toBe(true);
    });

    test("13. should return true when checking for empty object in nested structure", () => {
        const obj = { a: {} };
        expect(hasFields(obj, { a: {} })).toBe(true);
    });
});