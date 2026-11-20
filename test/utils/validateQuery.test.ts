import {
	validateQuery,
	validateSearch,
	validateUpdater,
} from "#utils/validateQuery";
import { describe, expect, test } from "bun:test";

describe("validateQuery", () => {
	test("1. skips strings and empty queries", () => {
		expect(() => validateQuery(undefined)).not.toThrow();
		expect(() => validateQuery("items", "removeCollection")).not.toThrow();
	});

	test("2. requires collection except for getCollections", () => {
		expect(() => validateQuery({}, "find")).toThrow('Missing "collection"');
		expect(() => validateQuery({}, "getCollections")).not.toThrow();
	});

	test("3. requires data even when id_gen is false", () => {
		expect(() =>
			validateQuery(
				{
					collection: "c",
					id_gen: false,
				},
				"add",
			),
		).toThrow('Missing required field "data"');
	});

	test("4. rejects non-object data unless id_gen is false", () => {
		expect(() =>
			validateQuery(
				{
					collection: "c",
					data: 5,
				} as any,
				"add",
			),
		).toThrow('"data" must be an object');
		expect(() =>
			validateQuery(
				{
					collection: "c",
					data: 5,
					id_gen: false,
				} as any,
				"add",
			),
		).not.toThrow();
	});

	test("5. rejects nullish bulkAdd items", () => {
		expect(() =>
			validateQuery(
				{
					collection: "c",
					datas: [
						null,
					],
					id_gen: false,
				} as any,
				"bulkAdd",
			),
		).toThrow('"datas" must not contain nullish items');
	});

	test("6. rejects non-object bulkAdd items when generating ids", () => {
		expect(() =>
			validateQuery(
				{
					collection: "c",
					datas: [
						1,
					],
				} as any,
				"bulkAdd",
			),
		).toThrow('"datas" must be an array of objects');
	});

	test("7. accepts valid add and bulkAdd payloads", () => {
		expect(() =>
			validateQuery(
				{
					collection: "c",
					data: {
						a: 1,
					},
				},
				"add",
			),
		).not.toThrow();
		expect(() =>
			validateQuery(
				{
					collection: "c",
					datas: [
						{
							a: 1,
						},
						{
							b: 2,
						},
					],
				},
				"bulkAdd",
			),
		).not.toThrow();
	});
});

describe("validateSearch", () => {
	test("8. requires an object or function", () => {
		expect(() => validateSearch(null)).not.toThrow();
		expect(() => validateSearch(() => true)).not.toThrow();
		expect(() => validateSearch([] as any)).toThrow("Search must be an object");
	});

	test("9. rejects arrays as conditions", () => {
		expect(() =>
			validateSearch({
				$not: [],
			}),
		).toThrow("$not must be an object");
		expect(() =>
			validateSearch({
				$subset: [],
			}),
		).toThrow("$subset must be an object");
		expect(() =>
			validateSearch({
				$or: [
					[],
				],
			}),
		).toThrow("Search condition must be an object");
		expect(() =>
			validateSearch({
				$and: [
					[],
				],
			}),
		).toThrow("Search condition must be an object");
	});

	test("10. rejects $and together with $or", () => {
		expect(() =>
			validateSearch({
				$and: [
					{
						a: 1,
					},
				],
				$or: [
					{
						b: 2,
					},
				],
			}),
		).toThrow("$and and $or cannot be used at the same level");
	});

	test("11. validates operator value shapes", () => {
		expect(() =>
			validateSearch({
				$in: {
					a: 1,
				},
			}),
		).toThrow("$in requires an array");
		expect(() =>
			validateSearch({
				$in: {
					a: [
						1,
						2,
					],
				},
			}),
		).not.toThrow();
		expect(() =>
			validateSearch({
				$between: {
					a: [
						1,
					],
				},
			}),
		).toThrow("$between requires [min, max]");
		expect(() =>
			validateSearch({
				$regex: {
					a: /x/,
				},
			}),
		).not.toThrow();
	});

	test("12. accepts nested conditions", () => {
		expect(() =>
			validateSearch({
				$and: [
					{
						$gt: {
							a: 1,
						},
					},
					{
						$or: [
							{
								b: 2,
							},
						],
					},
				],
			}),
		).not.toThrow();
	});
});

describe("validateUpdater", () => {
	test("13. requires an object or function", () => {
		expect(() => validateUpdater(null)).not.toThrow();
		expect(() =>
			validateUpdater(() => ({
				a: 1,
			})),
		).not.toThrow();
		expect(() => validateUpdater([] as any)).toThrow(
			"Updater must be an object",
		);
	});

	test("14. validates operator value shapes", () => {
		expect(() =>
			validateUpdater({
				$pushall: {
					a: 1,
				},
			}),
		).toThrow("$pushall requires an array");
		expect(() =>
			validateUpdater({
				$pushall: {
					a: [
						1,
					],
				},
			}),
		).not.toThrow();
		expect(() =>
			validateUpdater({
				$rename: {
					a: 1,
				},
			}),
		).toThrow("$rename requires a string");
		expect(() =>
			validateUpdater({
				$deepmerge: "x",
			}),
		).not.toThrow();
	});
});
