import { describe, test, expect } from "bun:test";
import updateObjectAdvanced from "#utils/updateObject";
import Data from "#types/data";

describe("updateObjectAdvanced", () => {
    test("1. should throw error for non-object fields", () => {
        expect(() => updateObjectAdvanced({}, null)).toThrow("Fields must be an object or object array");
        // @ts-expect-error
        expect(() => updateObjectAdvanced({}, "string")).toThrow("Fields must be an object or object array");
        // @ts-expect-error
        expect(() => updateObjectAdvanced({}, 123)).toThrow("Fields must be an object or object array");
    });

    test("2. should handle single field object", () => {
        const obj = { a: 1, b: 2 };
        const result = updateObjectAdvanced(obj, { c: 3 });
        expect(result).toEqual({ a: 1, b: 2, c: 3 });
        expect(obj).toEqual({ a: 1, b: 2 });
    });

    test("3. should handle array of field objects", () => {
        const obj = { a: 1, b: 2 };
        const result = updateObjectAdvanced(obj, { c: 3, d: 4 });
        expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
        expect(obj).toEqual({ a: 1, b: 2 });
    });

    test("4. should handle $push operator", () => {
        const obj = { arr: [1, 2] };
        const result = updateObjectAdvanced(obj, { $push: { arr: 3 } });
        expect(result.arr).toEqual([1, 2, 3]);
        expect(obj.arr).toEqual([1, 2]);

        const obj2: Data = {};
        const result2 = updateObjectAdvanced(obj2, { $push: { arr: 1 } });
        expect(result2.arr).toEqual([1]);
        expect(obj2).toEqual({});
    });

    test("5. should handle $pushSet operator", () => {
        const obj = { arr: [1, 2] };
        let result = updateObjectAdvanced(obj, { $pushSet: { arr: 2 } });
        expect(result.arr).toEqual([1, 2]);
        expect(obj.arr).toEqual([1, 2]);

        const originalResult = result;
        result = updateObjectAdvanced(result, { $pushSet: { arr: 3 } });
        expect(result.arr).toEqual([1, 2, 3]);
        expect(originalResult.arr).toEqual([1, 2]);
    });

    test("6. should handle $pull operator", () => {
        const obj = { arr: [1, 2, 3, 2] };
        const result = updateObjectAdvanced(obj, { $pull: { arr: 2 } });
        expect(result.arr).toEqual([1, 3]);
        expect(obj.arr).toEqual([1, 2, 3, 2]);
    });

    test("7. should handle $pullall operator", () => {
        const obj = { arr: [1, 2, 3, 4, 5] };
        const result = updateObjectAdvanced(obj, { $pullall: { arr: [2, 4] } });
        expect(result.arr).toEqual([1, 3, 5]);
        expect(obj.arr).toEqual([1, 2, 3, 4, 5]);
    });

    test("8. should handle $merge operator", () => {
        const obj: Data = { obj: { a: 1, b: 2 } };
        const result = updateObjectAdvanced(obj, { $merge: { obj: { b: 3, c: 4 } } });
        expect(result.obj).toEqual({ a: 1, b: 3, c: 4 });
        expect(obj.obj).toEqual({ a: 1, b: 2 });

        const obj2: Data = {};
        const result2 = updateObjectAdvanced(obj2, { $merge: { obj: { a: 1 } } });
        expect(result2.obj).toEqual({ a: 1 });
        expect(obj2).toEqual({});
    });

    test("9. should handle $deepMerge operator", () => {
        const obj: Data = { obj: { a: { b: 1 }, c: 2 } };
        const result = updateObjectAdvanced(obj, { $deepMerge: { obj: { a: { d: 3 }, c: 4 } } });
        expect(result.obj).toEqual({ a: { b: 1, d: 3 }, c: 4 });
        expect(obj.obj).toEqual({ a: { b: 1 }, c: 2 });

        const obj2: Data = {};
        const result2 = updateObjectAdvanced(obj2, { $deepMerge: { obj: { a: 1 } } });
        expect(result2.obj).toEqual({ a: 1 });
        expect(obj2).toEqual({});
    });

    test("10. should handle $inc operator", () => {
        const obj = { num: 5 };
        const result = updateObjectAdvanced(obj, { $inc: { num: 3 } });
        expect(result.num).toBe(8);
        expect(obj.num).toBe(5);

        const obj2: Data = {};
        const result2 = updateObjectAdvanced(obj2, { $inc: { num: 5 } });
        expect(result2.num).toBe(5);
        expect(obj2).toEqual({});

        expect(() => {
            const obj3 = { str: "hello" };
            updateObjectAdvanced(obj3, { $inc: { str: 1 } });
        }).toThrow("Cannot increment non-numeric value at key: str");
    });

    test("11. should handle $dec operator", () => {
        const obj = { num: 10 };
        const result = updateObjectAdvanced(obj, { $dec: { num: 3 } });
        expect(result.num).toBe(7);
        expect(obj.num).toBe(10);

        const obj2: Data = {};
        const result2 = updateObjectAdvanced(obj2, { $dec: { num: 5 } });
        expect(result2.num).toBe(-5);
        expect(obj2).toEqual({});

        expect(() => {
            const obj3 = { str: "hello" };
            updateObjectAdvanced(obj3, { $dec: { str: 1 } });
        }).toThrow("Cannot decrement non-numeric value at key: str");
    });

    test("12. should handle $rename operator", () => {
        const obj: Data = { oldKey: "value" };
        const result = updateObjectAdvanced(obj, { $rename: { oldKey: "newKey" } });
        expect(result).toEqual({ newKey: "value" });
        expect(obj).toEqual({ oldKey: "value" });

        const obj2: Data = { a: 1, b: 2 };
        const result2 = updateObjectAdvanced(obj2, { $rename: { a: "c" } });
        expect(result2).toEqual({ c: 1, b: 2 });
        expect(obj2).toEqual({ a: 1, b: 2 });
    });

    test("13. should handle $set operator", () => {
        const obj: Data = { a: 1 };
        let result = updateObjectAdvanced(obj, { $set: { a: 2 } });
        expect(result.a).toBe(2);
        expect(obj.a).toBe(1);

        const previousResult = result;
        result = updateObjectAdvanced(result, { $set: { b: 3 } });
        expect(result.b).toBe(3);
        expect(result.a).toBe(2);
        expect(previousResult.b).toBe(undefined);
    });

    test("14. should handle $unset operator", () => {
        const obj: Data = { a: 1, b: 2, c: 3 };
        const result = updateObjectAdvanced(obj, { $unset: { b: 1 } });
        expect(result).toEqual({ a: 1, c: 3 });
        expect(obj).toEqual({ a: 1, b: 2, c: 3 });
    });

    test("15. should handle multiple operators in one call", () => {
        const obj: Data = { a: 1, b: [1, 2], c: { x: 1 } };
        const result = updateObjectAdvanced(obj, {
            $inc: { a: 2 },
            $push: { b: 3 },
            $merge: { c: { y: 2 } },
            $unset: { d: 1 }
        });
        expect(result).toEqual({ a: 3, b: [1, 2, 3], c: { x: 1, y: 2 } });
        expect(obj).toEqual({ a: 1, b: [1, 2], c: { x: 1 } });
    });

    test("16. should handle complex nested updates", () => {
        const obj: Data = {
            arr: [1, 2, 3],
            num: 5,
            obj: { a: 1, b: 2 }
        };

        const result = updateObjectAdvanced(obj,
            {
                $push: { arr: 4 },
                $inc: { num: 5 },
                $merge: {
                    obj: { c: 3 }
                }
            }
        );

        expect(result).toEqual({
            arr: [1, 2, 3, 4],
            num: 10,
            obj: { a: 1, b: 2, c: 3 }
        });
        expect(obj).toEqual({
            arr: [1, 2, 3],
            num: 5,
            obj: { a: 1, b: 2 }
        });
    });

    test("17. should update fields not starting with $", () => {
        const obj: Data = { a: 1, b: 2 };
        const result = updateObjectAdvanced(obj, { c: 3, d: 4 });
        expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
        expect(obj).toEqual({ a: 1, b: 2 });
    });

    test("18. should handle empty update and return same object reference", () => {
        const obj = { a: 1, b: 2 };
        const result = updateObjectAdvanced(obj, {});
        expect(result).toBe(obj);
        expect(obj).toEqual({ a: 1, b: 2 });
    });
});