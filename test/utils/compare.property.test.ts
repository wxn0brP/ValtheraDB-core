import fc from "fast-check";
import { compareSafe } from "#utils/compare";
import { describe, expect, test } from "bun:test";

describe("compareSafe - property-based", () => {
	test("reflexivity: compareSafe(a, a) === 0 for same-type values", () => {
		fc.assert(
			fc.property(fc.oneof(fc.integer(), fc.string(), fc.boolean()), a => {
				expect(compareSafe(a, a)).toBe(0);
			}),
		);
	});

	test("reflexivity for dates", () => {
		fc.assert(
			fc.property(
				fc.integer({
					min: 0,
					max: 4_000_000_000_000,
				}),
				ts => {
					const d = new Date(ts);
					expect(compareSafe(d, new Date(ts))).toBe(0);
				},
			),
		);
	});

	test("antisymmetry: sign(compareSafe(a, b)) === -sign(compareSafe(b, a))", () => {
		fc.assert(
			fc.property(fc.integer(), fc.integer(), (a, b) => {
				const ab = compareSafe(a, b);
				const ba = compareSafe(b, a);
				expect(ab).toBe(-ba as -1 | 0 | 1);
			}),
		);
	});

	test("antisymmetry for strings", () => {
		fc.assert(
			fc.property(fc.string(), fc.string(), (a, b) => {
				const ab = compareSafe(a, b);
				const ba = compareSafe(b, a);
				if (ab === 0) expect(ba).toBe(0);
				else expect(ba).toBe(-ab as -1 | 0 | 1);
			}),
		);
	});

	test("transitivity for integers", () => {
		fc.assert(
			fc.property(fc.integer(), fc.integer(), fc.integer(), (a, b, c) => {
				const ab = compareSafe(a, b);
				const bc = compareSafe(b, c);
				if (ab === -1 && bc === -1) {
					expect(compareSafe(a, c)).toBe(-1);
				}
			}),
		);
	});

	test("null and undefined are treated as equal", () => {
		expect(compareSafe(null, null)).toBe(0);
		expect(compareSafe(undefined, undefined)).toBe(0);
		expect(compareSafe(null, undefined)).toBe(0);
		expect(compareSafe(undefined, null)).toBe(0);
	});

	test("null/undefined come after non-null values", () => {
		fc.assert(
			fc.property(fc.oneof(fc.integer(), fc.string()), a => {
				expect(compareSafe(null, a)).toBe(1);
				expect(compareSafe(a, null)).toBe(-1);
				expect(compareSafe(undefined, a)).toBe(1);
				expect(compareSafe(a, undefined)).toBe(-1);
			}),
		);
	});

	test("result is always in {-1, 0, 1}", () => {
		fc.assert(
			fc.property(
				fc.oneof(
					fc.integer(),
					fc.string(),
					fc.boolean(),
					fc.constant(null),
					fc.constant(undefined),
				),
				fc.oneof(
					fc.integer(),
					fc.string(),
					fc.boolean(),
					fc.constant(null),
					fc.constant(undefined),
				),
				(a, b) => {
					const result = compareSafe(a, b);
					expect([
						-1,
						0,
						1,
					]).toContain(result);
				},
			),
		);
	});

	test("different types fallback to 0", () => {
		fc.assert(
			fc.property(fc.integer(), fc.string(), (num, str) => {
				expect(compareSafe(num, str)).toBe(0);
				expect(compareSafe(str, num)).toBe(0);
			}),
		);
	});

	test("number-date comparison is consistent", () => {
		fc.assert(
			fc.property(
				fc.integer({
					min: 0,
					max: 4_000_000_000_000,
				}),
				ts => {
					const d = new Date(ts);
					expect(compareSafe(ts, d)).toBe(0);
				},
			),
		);
	});
});
