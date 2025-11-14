import { describe, test, expect } from "bun:test";
import hasFieldsAdvanced from "#utils/hasFieldsAdvanced";

describe("hasFieldsAdvanced", () => {
    test("should return true for empty fields", () => {
        expect(hasFieldsAdvanced({}, {})).toBe(true);
    });

    test("should throw error for non-object fields", () => {
        expect(() => hasFieldsAdvanced({}, null)).toThrow("Fields must be an object");
        // @ts-expect-error
        expect(() => hasFieldsAdvanced({}, "string")).toThrow("Fields must be an object");
        // @ts-expect-error
        expect(() => hasFieldsAdvanced({}, 123)).toThrow("Fields must be an object");
    });

    test("should handle $and operator", () => {
        const obj = { a: 5, b: 10 };
        expect(
            hasFieldsAdvanced(obj, {
                $and: [
                    { a: 5 },
                    { b: 10 }
                ]
            })
        ).toBe(true);

        expect(
            hasFieldsAdvanced(obj, {
                $and: [
                    { a: 5 },
                    { b: 20 }
                ]
            })
        ).toBe(false);
    });

    test("should handle $or operator", () => {
        const obj = { a: 5, b: 10 };
        expect(
            hasFieldsAdvanced(obj, {
                $or: [
                    { a: 6 },
                    { b: 10 }
                ]
            })
        ).toBe(true);

        expect(
            hasFieldsAdvanced(obj, {
                $or: [
                    { a: 6 },
                    { b: 8 }
                ]
            })
        ).toBe(false);
    });

    test("should handle $gt operator", () => {
        const obj = { a: 10, b: 5 };
        expect(hasFieldsAdvanced(obj, { $gt: { a: 5 } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $gt: { a: 15 } })).toBe(false);
    });

    test("should handle $lt operator", () => {
        const obj = { a: 10, b: 5 };
        expect(hasFieldsAdvanced(obj, { $lt: { a: 15 } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $lt: { a: 5 } })).toBe(false);
    });

    test("should handle $gte operator", () => {
        const obj = { a: 10, b: 5 };
        expect(hasFieldsAdvanced(obj, { $gte: { a: 10 } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $gte: { a: 9 } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $gte: { a: 11 } })).toBe(false);
    });

    test("should handle $lte operator", () => {
        const obj = { a: 10, b: 5 };
        expect(hasFieldsAdvanced(obj, { $lte: { a: 10 } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $lte: { a: 11 } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $lte: { a: 9 } })).toBe(false);
    });

    test("should handle $in operator", () => {
        const obj = { a: 5, b: "hello" };
        expect(hasFieldsAdvanced(obj, { $in: { a: [1, 2, 5] } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $in: { a: [1, 2, 3] } })).toBe(false);
    });

    test("should handle $nin operator", () => {
        const obj = { a: 5, b: "hello" };
        expect(hasFieldsAdvanced(obj, { $nin: { a: [1, 2, 7] } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $nin: { a: [1, 2, 5] } })).toBe(false);
    });

    test("should handle $type operator", () => {
        const obj = { a: 5, b: "hello", c: true };
        expect(hasFieldsAdvanced(obj, { $type: { a: "number" } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $type: { b: "string" } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $type: { c: "boolean" } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $type: { a: "string" } })).toBe(false);
    });

    test("should handle $exists operator", () => {
        const obj = { a: 5, b: undefined };
        expect(hasFieldsAdvanced(obj, { $exists: { a: true } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $exists: { c: false } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $exists: { a: false } })).toBe(false);
        expect(hasFieldsAdvanced(obj, { $exists: { c: true } })).toBe(false);
    });

    test("should handle $regex operator", () => {
        const obj = { text: "hello world" };
        expect(hasFieldsAdvanced(obj, { $regex: { text: "hello" } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $regex: { text: "^hello" } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $regex: { text: "goodbye" } })).toBe(false);
    });

    test("should handle $size operator", () => {
        const obj = { arr: [1, 2, 3], str: "abc" };
        expect(hasFieldsAdvanced(obj, { $size: { arr: 3 } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $size: { str: 3 } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $size: { arr: 2 } })).toBe(false);
    });

    test("should handle $startsWith operator", () => {
        const obj = { text: "hello world" };
        expect(hasFieldsAdvanced(obj, { $startsWith: { text: "hello" } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $startsWith: { text: "world" } })).toBe(false);
    });

    test("should handle $endsWith operator", () => {
        const obj = { text: "hello world" };
        expect(hasFieldsAdvanced(obj, { $endsWith: { text: "world" } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $endsWith: { text: "hello" } })).toBe(false);
    });

    test("should handle $between operator", () => {
        const obj = { num: 10 };
        expect(hasFieldsAdvanced(obj, { $between: { num: [5, 15] } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $between: { num: [15, 20] } })).toBe(false);
    });

    test("should handle $arrinc operator", () => {
        const obj = { arr: [1, 2, 3] };
        expect(hasFieldsAdvanced(obj, { $arrinc: { arr: [2, 4] } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $arrinc: { arr: [4, 5] } })).toBe(false);
    });

    test("should handle $arrincall operator", () => {
        const obj = { arr: [1, 2, 3] };
        expect(hasFieldsAdvanced(obj, { $arrincall: { arr: [1, 2] } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $arrincall: { arr: [1, 4] } })).toBe(false);
    });

    test("should handle $not operator", () => {
        const obj = { a: 5, b: 10 };
        expect(hasFieldsAdvanced(obj, { $not: { a: 10 } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $not: { a: 5 } })).toBe(false);
    });

    test("should handle $subset operator", () => {
        const obj = { a: 5, b: 10, c: 15 };
        expect(hasFieldsAdvanced(obj, { $subset: { a: 5, b: 10 } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $subset: { a: 5, b: 20 } })).toBe(false);
    });

    test("should combine multiple operators", () => {
        const obj = { a: 10, b: "hello", c: [1, 2, 3] };
        expect(
            hasFieldsAdvanced(obj, {
                $gt: { a: 5 },
                $startsWith: { b: "he" },
                $size: { c: 3 }
            })
        ).toBe(true);

        expect(
            hasFieldsAdvanced(obj, {
                $gt: { a: 15 },
                $startsWith: { b: "he" },
                $size: { c: 3 }
            })
        ).toBe(false);
    });

    test("should handle complex nested conditions", () => {
        const obj = { a: 10, b: "hello", c: [1, 2, 3] };
        expect(
            hasFieldsAdvanced(obj, {
                $or: [
                    {
                        $gt: { a: 5 },
                        $startsWith: { b: "he" }
                    },
                    {
                        $size: { c: 2 }
                    }
                ]
            })
        ).toBe(true);

        expect(
            hasFieldsAdvanced(obj, {
                $and: [
                    {
                        $gt: { a: 5 },
                        $startsWith: { b: "he" }
                    },
                    {
                        $size: { c: 2 }
                    }
                ]
            })
        ).toBe(false);
    });
});