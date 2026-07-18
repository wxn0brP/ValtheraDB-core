import { FindOpts } from "#types/options";
import { updateFindObject } from "#utils/updateFindObject";
import { describe, expect, test } from "bun:test";

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
			transform: (o: any) => ({ ...o, transformed: true }),
		};
		const result = updateFindObject(obj, findOpts);

		expect(result).toEqual({ a: 1, b: 2, transformed: true });
	});

	test("3. should exclude specified fields", () => {
		const obj = { a: 1, b: 2, c: 3, d: 4 };
		const findOpts: FindOpts = {
			exclude: ["b", "d"],
		};
		const result = updateFindObject(obj, findOpts);

		expect(result).toEqual({ a: 1, c: 3 });
	});

	test("4. should select specified fields", () => {
		const obj = { a: 1, b: 2, c: 3, d: 4 };
		const findOpts: FindOpts = {
			select: ["a", "c"],
		};
		const result = updateFindObject(obj, findOpts);

		expect(result).toEqual({ a: 1, c: 3 });
	});

	test("5. should handle non-existent fields in exclude", () => {
		const obj = { a: 1, b: 2 };
		const findOpts: FindOpts = {
			exclude: ["c", "d"], // fields that don't exist
		};
		const result = updateFindObject(obj, findOpts);

		expect(result).toEqual({ a: 1, b: 2 }); // unchanged
	});

	test("6. should handle non-existent fields in select", () => {
		const obj = { a: 1, b: 2 };
		const findOpts: FindOpts = {
			select: ["a", "c"], // "c" doesn't exist
		};
		const result = updateFindObject(obj, findOpts);

		expect(result).toEqual({ a: 1 }); // only "a" is selected
	});

	test("7. should apply transform, then exclude, then select in that order", () => {
		const obj = { a: 1, b: 2, c: 3 };
		const findOpts: FindOpts = {
			transform: (o: any) => ({ ...o, d: 4, e: 5 }),
			exclude: ["b", "e"],
			select: ["a", "c", "d"], // should include a, c, d but not b, e
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
			select: [],
		};
		const result = updateFindObject(obj, findOpts);

		expect(result).toEqual({});
	});

	test("10. should handle empty exclude array", () => {
		const obj = { a: 1, b: 2, c: 3 };
		const findOpts: FindOpts = {
			exclude: [],
		};
		const result = updateFindObject(obj, findOpts);

		expect(result).toEqual({ a: 1, b: 2, c: 3 }); // unchanged
	});

	test("11. should handle both select and exclude (select takes precedence)", () => {
		const obj = { a: 1, b: 2, c: 3, d: 4 };
		const findOpts: FindOpts = {
			select: ["a", "b", "c"],
			exclude: ["b"], // b should be excluded even though it's in select
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
			b: 2,
		};
		const findOpts: FindOpts = {
			select: ["a", "nested"],
		};
		const result = updateFindObject(obj, findOpts);

		expect(result).toEqual({
			a: 1,
			nested: { x: 10, y: 20 },
		});
	});

	test("13. select with dotted path should extract nested field", () => {
		const obj = { a: 1, nested: { x: 10, y: 20 } };
		const findOpts: FindOpts = { select: ["a", "nested.x"] };
		const result = updateFindObject(obj, findOpts);

		expect(result).toEqual({ a: 1, nested: { x: 10 } });
	});

	test("14. select with array path should extract nested field", () => {
		const obj = { a: 1, nested: { x: 10, y: 20 } };
		const findOpts: FindOpts = { select: [["nested", "y"]] };
		const result = updateFindObject(obj, findOpts);

		expect(result).toEqual({ nested: { y: 20 } });
	});

	test("15. select with mixed paths (flat, dotted, array)", () => {
		const obj = { a: 1, b: { c: 2 }, d: { e: 3 } };
		const findOpts: FindOpts = { select: ["a", "b.c", ["d", "e"]] };
		const result = updateFindObject(obj, findOpts);

		expect(result).toEqual({ a: 1, b: { c: 2 }, d: { e: 3 } });
	});

	test("16. exclude with dotted path should remove nested field", () => {
		const obj = { a: 1, nested: { x: 10, y: 20 } };
		const findOpts: FindOpts = { exclude: ["nested.x"] };
		const result = updateFindObject(obj, findOpts);

		expect(result).toEqual({ a: 1, nested: { y: 20 } });
	});

	test("17. exclude with array path should remove nested field", () => {
		const obj = { a: 1, nested: { x: 10, y: 20 } };
		const findOpts: FindOpts = { exclude: [["nested", "y"]] };
		const result = updateFindObject(obj, findOpts);

		expect(result).toEqual({ a: 1, nested: { x: 10 } });
	});

	test("18. non-existent nested path in select should be silently skipped", () => {
		const obj = { a: 1, b: 2 };
		const findOpts: FindOpts = { select: ["a", "nested.z", "b"] };
		const result = updateFindObject(obj, findOpts);

		expect(result).toEqual({ a: 1, b: 2 });
	});

	test("19. path through a primitive value should be skipped", () => {
		const obj = { a: 5, b: { c: 3 } };
		const findOpts: FindOpts = { select: ["a.b", "b.c"] };
		const result = updateFindObject(obj, findOpts);

		expect(result).toEqual({ b: { c: 3 } });
	});

	test("20. deeply nested path (3+ levels)", () => {
		const obj = { a: { b: { c: { d: 42 } } }, e: 1 };
		const findOpts: FindOpts = { select: ["a.b.c.d", "e"] };
		const result = updateFindObject(obj, findOpts);

		expect(result).toEqual({ a: { b: { c: { d: 42 } } }, e: 1 });
	});

	test("21. select then exclude with nested paths", () => {
		const obj = { a: 1, nested: { x: 10, y: 20, z: 30 }, b: 2 };
		const findOpts: FindOpts = {
			select: ["a", "nested", "b"],
			exclude: ["nested.z"],
		};
		const result = updateFindObject(obj, findOpts);

		expect(result).toEqual({ a: 1, nested: { x: 10, y: 20 }, b: 2 });
	});

	test("22. empty array path should be skipped", () => {
		const obj = { a: 1, b: 2 };
		const findOpts: FindOpts = { select: ["a", [], "b"] };
		const result = updateFindObject(obj, findOpts);

		expect(result).toEqual({ a: 1, b: 2 });
	});

	test("23. array path with literal dot in key", () => {
		const obj = { "my.field": 42, a: 1 };
		const findOpts: FindOpts = { select: [["my.field"], "a"] };
		const result = updateFindObject(obj, findOpts);

		expect(result).toEqual({ "my.field": 42, a: 1 });
	});
});
