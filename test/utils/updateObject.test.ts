import { describe, test, expect } from "bun:test";
import updateObjectAdvanced from "#utils/updateObject";
import Data from "#types/data";

describe("updateObjectAdvanced", () => {
    test("should throw error for non-object fields", () => {
        expect(() => updateObjectAdvanced({}, null)).toThrow("Fields must be an object or object array");
        // @ts-expect-error
        expect(() => updateObjectAdvanced({}, "string")).toThrow("Fields must be an object or object array");
        // @ts-expect-error
        expect(() => updateObjectAdvanced({}, 123)).toThrow("Fields must be an object or object array");
    });

    test("should handle single field object", () => {
        const obj = { a: 1, b: 2 };
        const result = updateObjectAdvanced(obj, { c: 3 });
        expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    test("should handle array of field objects", () => {
        const obj = { a: 1, b: 2 };
        const result = updateObjectAdvanced(obj, { c: 3, d: 4 });
        expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    });

    test("should handle $push operator", () => {
        const obj = { arr: [1, 2] };
        updateObjectAdvanced(obj, { $push: { arr: 3 } });
        expect(obj.arr).toEqual([1, 2, 3]);

        const obj2: Data = {};
        updateObjectAdvanced(obj2, { $push: { arr: 1 } });
        expect(obj2.arr).toEqual([1]);
    });

    test("should handle $pushSet operator", () => {
        const obj = { arr: [1, 2] };
        updateObjectAdvanced(obj, { $pushSet: { arr: 2 } });
        expect(obj.arr).toEqual([1, 2]);

        updateObjectAdvanced(obj, { $pushSet: { arr: 3 } });
        expect(obj.arr).toEqual([1, 2, 3]);
    });

    test("should handle $pull operator", () => {
        const obj = { arr: [1, 2, 3, 2] };
        updateObjectAdvanced(obj, { $pull: { arr: 2 } });
        expect(obj.arr).toEqual([1, 3]);
    });

    test("should handle $pullall operator", () => {
        const obj = { arr: [1, 2, 3, 4, 5] };
        updateObjectAdvanced(obj, { $pullall: { arr: [2, 4] } });
        expect(obj.arr).toEqual([1, 3, 5]);
    });

    test("should handle $merge operator", () => {
        const obj: Data = { obj: { a: 1, b: 2 } };
        updateObjectAdvanced(obj, { $merge: { obj: { b: 3, c: 4 } } });
        expect(obj.obj).toEqual({ a: 1, b: 3, c: 4 });

        const obj2: Data = {};
        updateObjectAdvanced(obj2, { $merge: { obj: { a: 1 } } });
        expect(obj2.obj).toEqual({ a: 1 });
    });

    test("should handle $deepMerge operator", () => {
        const obj: Data = { obj: { a: { b: 1 }, c: 2 } };
        updateObjectAdvanced(obj, { $deepMerge: { obj: { a: { d: 3 }, c: 4 } } });
        expect(obj.obj).toEqual({ a: { b: 1, d: 3 }, c: 4 });

        const obj2: Data = {};
        updateObjectAdvanced(obj2, { $deepMerge: { obj: { a: 1 } } });
        expect(obj2.obj).toEqual({ a: 1 });
    });

    test("should handle $inc operator", () => {
        const obj = { num: 5 };
        updateObjectAdvanced(obj, { $inc: { num: 3 } });
        expect(obj.num).toBe(8);

        const obj2: Data = {};
        updateObjectAdvanced(obj2, { $inc: { num: 5 } });
        expect(obj2.num).toBe(5);

        expect(() => {
            const obj3 = { str: "hello" };
            updateObjectAdvanced(obj3, { $inc: { str: 1 } });
        }).toThrow("Cannot increment non-numeric value at key: str");
    });

    test("should handle $dec operator", () => {
        const obj = { num: 10 };
        updateObjectAdvanced(obj, { $dec: { num: 3 } });
        expect(obj.num).toBe(7);

        const obj2: Data = {};
        updateObjectAdvanced(obj2, { $dec: { num: 5 } });
        expect(obj2.num).toBe(-5);

        expect(() => {
            const obj3 = { str: "hello" };
            updateObjectAdvanced(obj3, { $dec: { str: 1 } });
        }).toThrow("Cannot decrement non-numeric value at key: str");
    });

    test("should handle $rename operator", () => {
        const obj: Data = { oldKey: "value" };
        updateObjectAdvanced(obj, { $rename: { oldKey: "newKey" } });
        expect(obj).toEqual({ newKey: "value" });

        const obj2: Data = { a: 1, b: 2 };
        updateObjectAdvanced(obj2, { $rename: { a: "c" } });
        expect(obj2).toEqual({ c: 1, b: 2 });
    });

    test("should handle $set operator", () => {
        const obj: Data = { a: 1 };
        updateObjectAdvanced(obj, { $set: { a: 2 } });
        expect(obj.a).toBe(2);

        updateObjectAdvanced(obj, { $set: { b: 3 } });
        expect(obj.b).toBe(3);
    });

    test("should handle $unset operator", () => {
        const obj: Data = { a: 1, b: 2, c: 3 };
        updateObjectAdvanced(obj, { $unset: { b: 1 } });
        expect(obj).toEqual({ a: 1, c: 3 });
    });

    test("should handle multiple operators in one call", () => {
        const obj: Data = { a: 1, b: [1, 2], c: { x: 1 } };
        updateObjectAdvanced(obj, {
            $inc: { a: 2 },
            $push: { b: 3 },
            $merge: { c: { y: 2 } },
            $unset: { d: 1 }
        });
        expect(obj).toEqual({ a: 3, b: [1, 2, 3], c: { x: 1, y: 2 } });
    });

    test("should handle complex nested updates", () => {
        const obj: Data = {
            arr: [1, 2, 3],
            num: 5,
            obj: { a: 1, b: 2 }
        };

        updateObjectAdvanced(obj,
            {
                $push: { arr: 4 },
                $inc: { num: 5 },
                $merge: {
                    obj: { c: 3 }
                }
            }
        );

        expect(obj).toEqual({
            arr: [1, 2, 3, 4],
            num: 10,
            obj: { a: 1, b: 2, c: 3 }
        });
    });

    test("should update fields not starting with $", () => {
        const obj: Data = { a: 1, b: 2 };
        updateObjectAdvanced(obj, { c: 3, d: 4 });
        expect(obj).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    });

    test("should handle empty update", () => {
        const obj = { a: 1, b: 2 };
        const result = updateObjectAdvanced(obj, {});
        expect(result).toBe(obj);
    });
});