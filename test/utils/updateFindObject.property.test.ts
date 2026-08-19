import fc from "fast-check";
import { updateFindObject } from "#utils/updateFindObject";
import { describe, expect, test } from "bun:test";

const flatObjArb = fc.dictionary(
	fc
		.string({
			minLength: 1,
			maxLength: 5,
		})
		.filter(s => !s.includes(".") && !s.includes(" ")),
	fc.oneof(fc.integer(), fc.string(), fc.boolean()),
	{
		minKeys: 1,
		maxKeys: 8,
	},
);

describe("updateFindObject - property-based", () => {
	test("empty findOpts returns same reference", () => {
		fc.assert(
			fc.property(flatObjArb, obj => {
				const result = updateFindObject(obj, {});
				expect(result).toBe(obj);
			}),
		);
	});

	test("select all keys preserves all values", () => {
		fc.assert(
			fc.property(flatObjArb, obj => {
				const keys = Object.keys(obj);
				const result = updateFindObject(obj, {
					select: keys,
				});
				expect(result).toEqual(obj);
			}),
		);
	});

	test("select empty array returns empty object", () => {
		fc.assert(
			fc.property(flatObjArb, obj => {
				const result = updateFindObject(obj, {
					select: [],
				});
				expect(result).toEqual({});
			}),
		);
	});

	test("exclude empty array preserves object", () => {
		fc.assert(
			fc.property(flatObjArb, obj => {
				const result = updateFindObject(obj, {
					exclude: [],
				});
				expect(result).toEqual(obj);
			}),
		);
	});

	test("select then exclude same keys returns empty object", () => {
		fc.assert(
			fc.property(flatObjArb, obj => {
				const keys = Object.keys(obj);
				const result = updateFindObject(obj, {
					select: keys,
					exclude: keys,
				});
				expect(result).toEqual({});
			}),
		);
	});

	test("exclude non-existent keys does not change object", () => {
		fc.assert(
			fc.property(flatObjArb, obj => {
				const result = updateFindObject(obj, {
					exclude: [
						"__nonexistent__",
					],
				});
				expect(result).toEqual(obj);
			}),
		);
	});

	test("select non-existent keys returns empty object", () => {
		fc.assert(
			fc.property(flatObjArb, obj => {
				const result = updateFindObject(obj, {
					select: [
						"__nonexistent__",
					],
				});
				expect(result).toEqual({});
			}),
		);
	});

	test("exclude removes only specified keys", () => {
		fc.assert(
			fc.property(flatObjArb, obj => {
				const keys = Object.keys(obj);
				if (keys.length === 0) return true;
				const toExclude = [
					keys[0],
				];
				const result = updateFindObject(obj, {
					exclude: toExclude,
				});
				expect(keys[0] in result).toBe(false);
				const remaining = keys.slice(1);
				for (const k of remaining) {
					expect(result[k]).toEqual(obj[k]);
				}
			}),
		);
	});

	test("select subset returns only those keys", () => {
		fc.assert(
			fc.property(flatObjArb, obj => {
				const keys = Object.keys(obj);
				if (keys.length < 2) return true;
				const subset = keys.slice(0, Math.ceil(keys.length / 2));
				const result = updateFindObject(obj, {
					select: subset,
				});
				expect(Object.keys(result).sort()).toEqual(subset.sort());
				for (const k of subset) {
					expect(result[k]).toEqual(obj[k]);
				}
			}),
		);
	});

	test("dotted select extracts nested field", () => {
		fc.assert(
			fc.property(
				fc
					.string({
						minLength: 1,
						maxLength: 3,
					})
					.filter(s => !s.includes(".") && !s.includes(" ")),
				fc
					.string({
						minLength: 1,
						maxLength: 3,
					})
					.filter(s => !s.includes(".") && !s.includes(" ")),
				fc.integer(),
				(k1, k2, val) => {
					if (k1 === k2) return true;
					const obj = {
						[k1]: {
							[k2]: val,
						},
					};
					const result = updateFindObject(obj, {
						select: [
							`${k1}.${k2}`,
						],
					});
					expect(result).toEqual({
						[k1]: {
							[k2]: val,
						},
					});
				},
			),
		);
	});

	test("dotted exclude removes nested field", () => {
		fc.assert(
			fc.property(
				fc
					.string({
						minLength: 1,
						maxLength: 3,
					})
					.filter(s => !s.includes(".") && !s.includes(" ")),
				fc
					.string({
						minLength: 1,
						maxLength: 3,
					})
					.filter(s => !s.includes(".") && !s.includes(" ")),
				fc.integer(),
				fc.integer(),
				(k1, k2, v1, v2) => {
					if (k1 === k2) return true;
					const obj = {
						[k1]: {
							[k2]: v1,
							other: v2,
						},
					};
					const result = updateFindObject(obj, {
						exclude: [
							`${k1}.${k2}`,
						],
					});
					expect(k2 in (result as any)[k1]).toBe(false);
				},
			),
		);
	});
});
