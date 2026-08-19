import fc from "fast-check";
import { hasFields } from "#utils/hasFields";
import { describe, expect, test } from "bun:test";

const flatObjectArb = fc.dictionary(
	fc.string({
		minLength: 1,
		maxLength: 5,
	}),
	fc.oneof(fc.integer(), fc.string(), fc.boolean()),
	{
		maxKeys: 5,
	},
);

describe("hasFields - property-based", () => {
	test("empty fields always match", () => {
		fc.assert(
			fc.property(flatObjectArb, obj => {
				expect(hasFields(obj, {})).toBe(true);
			}),
		);
	});

	test("identical objects match (self-match)", () => {
		fc.assert(
			fc.property(flatObjectArb, obj => {
				expect(hasFields(obj, obj)).toBe(true);
			}),
		);
	});

	test("monotonicity: subset of matching fields also matches", () => {
		fc.assert(
			fc.property(flatObjectArb, obj => {
				const keys = Object.keys(obj);
				if (keys.length === 0) return true;
				const subsetKeys = keys.slice(0, Math.ceil(keys.length / 2));
				const subset: Record<string, any> = {};
				for (const k of subsetKeys) subset[k] = obj[k];
				if (hasFields(obj, obj)) {
					expect(hasFields(obj, subset)).toBe(true);
				}
				return true;
			}),
		);
	});

	test("wrong value for existing key returns false", () => {
		fc.assert(
			fc.property(
				fc.dictionary(
					fc.string({
						minLength: 1,
					}),
					fc.integer(),
					{
						minKeys: 1,
						maxKeys: 5,
					},
				),
				obj => {
					const keys = Object.keys(obj);
					const key = keys[0];
					const wrongVal = obj[key] + 1;
					expect(
						hasFields(obj, {
							[key]: wrongVal,
						}),
					).toBe(false);
				},
			),
		);
	});

	test("missing key returns false", () => {
		fc.assert(
			fc.property(
				flatObjectArb,
				fc.string({
					minLength: 1,
				}),
				(obj, missingKey) => {
					if (missingKey in obj) return true;
					expect(
						hasFields(obj, {
							[missingKey]: 42,
						}),
					).toBe(false);
				},
			),
		);
	});

	test("nested empty object matches empty object field", () => {
		fc.assert(
			fc.property(
				fc.string({
					minLength: 1,
				}),
				key => {
					expect(
						hasFields(
							{
								[key]: {},
							},
							{
								[key]: {},
							},
						),
					).toBe(true);
				},
			),
		);
	});

	test("single-field match is consistent", () => {
		fc.assert(
			fc.property(
				fc.dictionary(
					fc.string({
						minLength: 1,
					}),
					fc.oneof(fc.integer(), fc.string()),
					{
						minKeys: 1,
						maxKeys: 3,
					},
				),
				obj => {
					const key = Object.keys(obj)[0];
					const fields = {
						[key]: obj[key],
					};
					expect(hasFields(obj, fields)).toBe(true);
				},
			),
		);
	});
});
