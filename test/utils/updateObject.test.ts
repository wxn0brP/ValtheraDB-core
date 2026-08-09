import { Data } from "#types/data";
import { updateObjectAdvanced } from "#utils/updateObject";
import { describe, expect, test } from "bun:test";

describe("updateObjectAdvanced", () => {
	test("1. should throw error for non-object fields", () => {
		expect(() => updateObjectAdvanced({}, null)).toThrow(
			"Fields must be an object",
		);
		// @ts-expect-error
		expect(() => updateObjectAdvanced({}, "string")).toThrow(
			"Fields must be an object",
		);
		// @ts-expect-error
		expect(() => updateObjectAdvanced({}, 123)).toThrow(
			"Fields must be an object",
		);
	});

	test("2. should handle single field object", () => {
		const obj: any = { a: 1, b: 2 };
		const result = updateObjectAdvanced(obj, { c: 3 });
		expect(result).toBeUndefined();
		expect(obj).toEqual({ a: 1, b: 2, c: 3 });
	});

	test("3. should handle array of field objects", () => {
		const obj: any = { a: 1, b: 2 };
		const result = updateObjectAdvanced(obj, { c: 3, d: 4 });
		expect(result).toBeUndefined();
		expect(obj).toEqual({ a: 1, b: 2, c: 3, d: 4 });
	});

	test("4. should handle $push operator", () => {
		const obj = { arr: [1, 2] };
		const result = updateObjectAdvanced(obj, { $push: { arr: 3 } });
		expect(result).toBeUndefined();
		expect(obj.arr).toEqual([1, 2, 3]);

		const obj2: Data = {};
		const result2 = updateObjectAdvanced(obj2, { $push: { arr: 1 } });
		expect(result2).toBeUndefined();
		expect(obj2.arr).toEqual([1]);
	});

	test("5. should handle $pushSet operator", () => {
		const obj = { arr: [1, 2] };
		updateObjectAdvanced(obj, { $pushSet: { arr: 2 } });
		expect(obj.arr).toEqual([1, 2]);

		updateObjectAdvanced(obj, { $pushSet: { arr: 3 } });
		expect(obj.arr).toEqual([1, 2, 3]);
	});

	test("6. should handle $pull operator", () => {
		const obj = { arr: [1, 2, 3, 2] };
		const result = updateObjectAdvanced(obj, { $pull: { arr: 2 } });
		expect(result).toBeUndefined();
		expect(obj.arr).toEqual([1, 3]);
	});

	test("7. should handle $pullAll operator", () => {
		const obj = { arr: [1, 2, 3, 4, 5] };
		const result = updateObjectAdvanced(obj, { $pullAll: { arr: [2, 4] } });
		expect(result).toBeUndefined();
		expect(obj.arr).toEqual([1, 3, 5]);
	});

	test("8. should handle $merge operator", () => {
		const obj: Data = { obj: { a: 1, b: 2 } };
		const result = updateObjectAdvanced(obj, {
			$merge: { obj: { b: 3, c: 4 } },
		});
		expect(result).toBeUndefined();
		expect(obj.obj).toEqual({ a: 1, b: 3, c: 4 });

		const obj2: Data = {};
		const result2 = updateObjectAdvanced(obj2, { $merge: { obj: { a: 1 } } });
		expect(result2).toBeUndefined();
		expect(obj2.obj).toEqual({ a: 1 });
	});

	test("9. should handle $deepMerge operator", () => {
		const obj: Data = { obj: { a: { b: 1 }, c: 2 } };
		const result = updateObjectAdvanced(obj, {
			$deepMerge: { obj: { a: { d: 3 }, c: 4 } },
		});
		expect(result).toBeUndefined();
		expect(obj.obj).toEqual({ a: { b: 1, d: 3 }, c: 4 });
	});

	test("10. should handle $inc operator", () => {
		const obj = { num: 5 };
		const result = updateObjectAdvanced(obj, { $inc: { num: 3 } });
		expect(result).toBeUndefined();
		expect(obj.num).toBe(8);

		const obj2: Data = {};
		const result2 = updateObjectAdvanced(obj2, { $inc: { num: 5 } });
		expect(result2).toBeUndefined();
		expect(obj2.num).toBe(5);

		expect(() => {
			const obj3 = { str: "hello" };
			updateObjectAdvanced(obj3, { $inc: { str: 1 } });
		}).toThrow("Cannot increment non-numeric value at key: str");
	});

	test("11. should handle $dec operator", () => {
		const obj = { num: 10 };
		const result = updateObjectAdvanced(obj, { $dec: { num: 3 } });
		expect(result).toBeUndefined();
		expect(obj.num).toBe(7);

		const obj2: Data = {};
		const result2 = updateObjectAdvanced(obj2, { $dec: { num: 5 } });
		expect(result2).toBeUndefined();
		expect(obj2.num).toBe(-5);

		expect(() => {
			const obj3 = { str: "hello" };
			updateObjectAdvanced(obj3, { $dec: { str: 1 } });
		}).toThrow("Cannot decrement non-numeric value at key: str");
	});

	test("12. should handle $rename operator", () => {
		const obj: Data = { oldKey: "value" };
		const result = updateObjectAdvanced(obj, { $rename: { oldKey: "newKey" } });
		expect(result).toBeUndefined();
		expect(obj).toEqual({ newKey: "value" });

		const obj2: Data = { a: 1, b: 2 };
		const result2 = updateObjectAdvanced(obj2, { $rename: { a: "c" } });
		expect(result2).toBeUndefined();
		expect(obj2).toEqual({ c: 1, b: 2 });
	});

	test("13. should handle $set operator", () => {
		const obj: Data = { a: 1 };
		updateObjectAdvanced(obj, { $set: { a: 2 } });
		expect(obj.a).toBe(2);

		const obj2: Data = { a: 1 };
		updateObjectAdvanced(obj2, { $set: { b: 3 } });
		expect(obj2.b).toBe(3);
		expect(obj2.a).toBe(1);
	});

	test("14. should handle $unset operator", () => {
		const obj: Data = { a: 1, b: 2, c: 3 };
		const result = updateObjectAdvanced(obj, { $unset: { b: 1 } });
		expect(result).toBeUndefined();
		expect(obj).toEqual({ a: 1, c: 3 });
	});

	test("15. should handle multiple operators in one call", () => {
		const obj: Data = { a: 1, b: [1, 2], c: { x: 1 } };
		const result = updateObjectAdvanced(obj, {
			$inc: { a: 2 },
			$push: { b: 3 },
			$merge: { c: { y: 2 } },
			$unset: { d: 1 },
		});
		expect(result).toBeUndefined();
		expect(obj).toEqual({ a: 3, b: [1, 2, 3], c: { x: 1, y: 2 } });
	});

	test("16. should handle complex nested updates", () => {
		const obj: Data = {
			arr: [1, 2, 3],
			num: 5,
			obj: { a: 1, b: 2 },
		};

		const result = updateObjectAdvanced(obj, {
			$push: { arr: 4 },
			$inc: { num: 5 },
			$merge: {
				obj: { c: 3 },
			},
		});

		expect(result).toBeUndefined();
		expect(obj).toEqual({
			arr: [1, 2, 3, 4],
			num: 10,
			obj: { a: 1, b: 2, c: 3 },
		});
	});

	test("17. should update fields not starting with $", () => {
		const obj: Data = { a: 1, b: 2 };
		const result = updateObjectAdvanced(obj, { c: 3, d: 4 });
		expect(result).toBeUndefined();
		expect(obj).toEqual({ a: 1, b: 2, c: 3, d: 4 });
	});

	test("18. should handle empty update and return undefined", () => {
		const obj = { a: 1, b: 2 };
		const result = updateObjectAdvanced(obj, {});
		expect(result).toBeUndefined();
		expect(obj).toEqual({ a: 1, b: 2 });
	});
});
