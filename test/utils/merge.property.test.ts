import fc from "fast-check";
import { deepMerge } from "#utils/merge";
import { describe, expect, test } from "bun:test";

const flatObjArb = fc.dictionary(
	fc.string({
		minLength: 1,
		maxLength: 5,
	}),
	fc.oneof(fc.integer(), fc.string(), fc.boolean()),
	{
		maxKeys: 5,
	},
);

const nestedObjArb: fc.Arbitrary<Record<string, any>> = fc.letrec(tie => ({
	obj: fc.oneof(
		{
			weight: 3,
			arbitrary: fc.dictionary(
				fc.string({
					minLength: 1,
					maxLength: 3,
				}),
				tie("value"),
				{
					maxKeys: 4,
				},
			),
		},
		{
			weight: 1,
			arbitrary: fc.constant({}),
		},
	),
	value: fc.oneof(
		{
			weight: 4,
			arbitrary: fc.integer(),
		},
		{
			weight: 2,
			arbitrary: fc.string(),
		},
		{
			weight: 2,
			arbitrary: tie("obj"),
		},
	),
})).obj as fc.Arbitrary<Record<string, any>>;

describe("deepMerge - property-based", () => {
	test("immutability: inputs are not mutated", () => {
		fc.assert(
			fc.property(nestedObjArb, nestedObjArb, (target, source) => {
				const targetCopy = structuredClone(target);
				const sourceCopy = structuredClone(source);
				deepMerge(target, source);
				expect(target).toEqual(targetCopy);
				expect(source).toEqual(sourceCopy);
			}),
		);
	});

	test("left identity: deepMerge({}, obj) deep-equals obj", () => {
		fc.assert(
			fc.property(nestedObjArb, obj => {
				const result = deepMerge({}, obj);
				expect(result).toEqual(obj);
			}),
		);
	});

	test("right identity: deepMerge(obj, {}) deep-equals obj", () => {
		fc.assert(
			fc.property(nestedObjArb, obj => {
				const result = deepMerge(obj, {});
				expect(result).toEqual(obj);
			}),
		);
	});

	test("idempotency: deepMerge(result, source) === result", () => {
		fc.assert(
			fc.property(nestedObjArb, nestedObjArb, (target, source) => {
				const result = deepMerge(target, source);
				const result2 = deepMerge(result, source);
				expect(result2).toEqual(result);
			}),
		);
	});

	test("source keys override target for non-object values", () => {
		fc.assert(
			fc.property(flatObjArb, flatObjArb, (target, source) => {
				const result = deepMerge(target, source);
				for (const key of Object.keys(source)) {
					if (typeof source[key] !== "object" || source[key] === null) {
						expect(result[key]).toBe(source[key]);
					}
				}
			}),
		);
	});

	test("target-only keys are preserved", () => {
		fc.assert(
			fc.property(flatObjArb, flatObjArb, (target, source) => {
				const result = deepMerge(target, source);
				for (const key of Object.keys(target)) {
					if (!(key in source)) {
						expect(result[key]).toEqual(target[key]);
					}
				}
			}),
		);
	});

	test("arrays are replaced, not merged", () => {
		fc.assert(
			fc.property(
				fc.array(fc.integer(), {
					minLength: 1,
					maxLength: 5,
				}),
				fc.array(fc.integer(), {
					minLength: 1,
					maxLength: 5,
				}),
				(a, b) => {
					const result = deepMerge(
						{
							arr: a,
						},
						{
							arr: b,
						},
					);
					expect(result.arr).toEqual(b);
				},
			),
		);
	});

	test("commutativity for disjoint keys", () => {
		fc.assert(
			fc.property(flatObjArb, flatObjArb, (a, b) => {
				const keysA = new Set(Object.keys(a));
				const keysB = new Set(Object.keys(b));
				const disjoint = [
					...keysA,
				].every(k => !keysB.has(k));
				if (!disjoint) return true;
				const ab = deepMerge(a, b);
				const ba = deepMerge(b, a);
				expect(ab).toEqual(ba);
			}),
		);
	});

	test("result contains all keys from both objects", () => {
		fc.assert(
			fc.property(flatObjArb, flatObjArb, (target, source) => {
				const result = deepMerge(target, source);
				const allKeys = new Set([
					...Object.keys(target),
					...Object.keys(source),
				]);
				for (const key of allKeys) {
					expect(key in result).toBe(true);
				}
			}),
		);
	});
});
