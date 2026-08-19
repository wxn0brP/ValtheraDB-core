import fc from "fast-check";
import { compareIds, convertIdToUnix, sortByIds } from "#utils/id";
import { describe, expect, test } from "bun:test";

describe("convertIdToUnix - property-based", () => {
	test("roundtrip: timestamp -> base36 id -> unix timestamp", () => {
		fc.assert(
			fc.property(
				fc.integer({
					min: 1,
					max: 4_000_000_000,
				}),
				timestamp => {
					const base36 = timestamp.toString(36);
					const id = `${base36}-abc`;
					expect(convertIdToUnix(id)).toBe(timestamp);
				},
			),
		);
	});

	test("only first segment (before hyphen) is parsed", () => {
		fc.assert(
			fc.property(
				fc.integer({
					min: 1,
					max: 4_000_000_000,
				}),
				fc.string({
					minLength: 1,
					maxLength: 10,
				}),
				(timestamp, suffix) => {
					const base36 = timestamp.toString(36);
					const id = `${base36}-${suffix}`;
					expect(convertIdToUnix(id)).toBe(timestamp);
				},
			),
		);
	});
});

describe("compareIds - property-based", () => {
	test("reflexivity: compareIds(a, a) === 0 for string IDs", () => {
		fc.assert(
			fc.property(
				fc.integer({
					min: 1,
					max: 4_000_000_000,
				}),
				ts => {
					const base36 = ts.toString(36);
					const id = `${base36}-abc`;
					expect(compareIds(id, id)).toBe(0);
				},
			),
		);
	});

	test("reflexivity for number IDs", () => {
		fc.assert(
			fc.property(fc.integer(), n => {
				expect(compareIds(n, n)).toBe(0);
			}),
		);
	});

	test("antisymmetry for number IDs", () => {
		fc.assert(
			fc.property(fc.integer(), fc.integer(), (a, b) => {
				const ab = compareIds(a, b);
				const ba = compareIds(b, a);
				if (ab === 0) expect(ba).toBe(0);
				else expect(ba).toBe(-ab);
			}),
		);
	});

	test("earlier timestamp sorts before later (string IDs)", () => {
		fc.assert(
			fc.property(
				fc.integer({
					min: 1,
					max: 2_000_000_000,
				}),
				fc.integer({
					min: 1,
					max: 2_000_000_000,
				}),
				(ts1, ts2) => {
					if (ts1 === ts2) return true;
					const id1 = `${ts1.toString(36)}-a`;
					const id2 = `${ts2.toString(36)}-b`;
					if (ts1 < ts2) {
						expect(compareIds(id1, id2)).toBeLessThan(0);
					} else {
						expect(compareIds(id1, id2)).toBeGreaterThan(0);
					}
				},
			),
		);
	});

	test("number IDs compare numerically", () => {
		fc.assert(
			fc.property(fc.integer(), fc.integer(), (a, b) => {
				if (a < b) expect(compareIds(a, b)).toBeLessThan(0);
				else if (a > b) expect(compareIds(a, b)).toBeGreaterThan(0);
				else expect(compareIds(a, b)).toBe(0);
			}),
		);
	});
});

describe("sortByIds - property-based", () => {
	test("does not mutate the original array", () => {
		fc.assert(
			fc.property(
				fc.array(
					fc
						.integer({
							min: 1,
							max: 4_000_000_000,
						})
						.map(ts => ({
							_id: `${ts.toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
							val: ts,
						})),
					{
						minLength: 1,
						maxLength: 20,
					},
				),
				objects => {
					const copy = structuredClone(objects);
					sortByIds(objects);
					expect(objects).toEqual(copy);
				},
			),
		);
	});

	test("preserves array length", () => {
		fc.assert(
			fc.property(
				fc.array(
					fc
						.integer({
							min: 1,
							max: 4_000_000_000,
						})
						.map(ts => ({
							_id: `${ts.toString(36)}-x`,
						})),
					{
						minLength: 0,
						maxLength: 20,
					},
				),
				objects => {
					expect(sortByIds(objects).length).toBe(objects.length);
				},
			),
		);
	});

	test("result is sorted (each element <= next)", () => {
		fc.assert(
			fc.property(
				fc.array(
					fc
						.integer({
							min: 1,
							max: 4_000_000_000,
						})
						.map(ts => ({
							_id: `${ts.toString(36)}-x`,
						})),
					{
						minLength: 2,
						maxLength: 20,
					},
				),
				objects => {
					const sorted = sortByIds(objects);
					for (let i = 0; i < sorted.length - 1; i++) {
						expect(
							compareIds(sorted[i]._id, sorted[i + 1]._id),
						).toBeLessThanOrEqual(0);
					}
				},
			),
		);
	});

	test("sorting an already-sorted array is idempotent", () => {
		fc.assert(
			fc.property(
				fc.array(
					fc
						.integer({
							min: 1,
							max: 4_000_000_000,
						})
						.map(ts => ({
							_id: `${ts.toString(36)}-x`,
						})),
					{
						minLength: 1,
						maxLength: 15,
					},
				),
				objects => {
					const first = sortByIds(objects);
					const second = sortByIds(first);
					expect(second).toEqual(first);
				},
			),
		);
	});
});
