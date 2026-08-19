import { deepMerge } from "#utils/merge";
import { describe, expect, test } from "bun:test";

describe("deepMerge", () => {
	test("1. should merge two simple objects", () => {
		const target = {
			a: 1,
			b: 2,
		};
		const source = {
			c: 3,
			d: 4,
		};
		const result = deepMerge(target, source);

		expect(result).toEqual({
			a: 1,
			b: 2,
			c: 3,
			d: 4,
		});
		expect(result).not.toBe(target); // Should return a new object
	});

	test.each([
		{
			target: {
				a: 1,
				b: 2,
				c: "old",
			},
			source: {
				c: "new",
				d: 4,
			},
			expected: {
				a: 1,
				b: 2,
				c: "new",
				d: 4,
			},
		},
		{
			target: {
				a: {
					x: 1,
					y: 2,
				},
				b: 3,
			},
			source: {
				a: {
					y: 20,
					z: 30,
				},
				c: 4,
			},
			expected: {
				a: {
					x: 1,
					y: 20,
					z: 30,
				},
				b: 3,
				c: 4,
			},
		},
		{
			target: {
				a: {
					x: 1,
				},
			},
			source: {
				a: "replaced",
			},
			expected: {
				a: "replaced",
			},
		},
	])("should deep merge objects ($#)", ({ target, source, expected }) => {
		expect(deepMerge(target, source)).toEqual(expected);
	});

	test.each([
		{
			target: {
				a: [
					1,
					2,
					3,
				],
			},
			source: {
				a: [
					4,
					5,
				],
			},
			expected: {
				a: [
					4,
					5,
				],
			},
		},
		{
			target: {
				arr: [
					{
						id: 1,
						name: "first",
					},
					{
						id: 2,
						name: "second",
					},
				],
			},
			source: {
				arr: [
					{
						id: 1,
						value: "updated",
					},
					{
						id: 3,
						name: "third",
					},
				],
			},
			expected: {
				arr: [
					{
						id: 1,
						value: "updated",
					},
					{
						id: 3,
						name: "third",
					},
				],
			},
		},
	])(
		"should replace arrays instead of merging ($#)",
		({ target, source, expected }) => {
			expect(deepMerge(target, source)).toEqual(expected);
		},
	);

	test("6. should handle target object with nested properties", () => {
		const target = {
			user: {
				name: "John",
				details: {
					age: 30,
					address: {
						city: "New York",
					},
				},
			},
		};

		const source = {
			user: {
				details: {
					address: {
						country: "USA",
					},
					email: "john@example.com",
				},
			},
		};

		const result = deepMerge(target, source);

		expect(result).toEqual({
			user: {
				name: "John",
				details: {
					age: 30,
					address: {
						city: "New York",
						country: "USA",
					},
					email: "john@example.com",
				},
			},
		});
	});

	test("7. should handle null or non-object values", () => {
		const target = {
			a: 1,
		};
		const source = null;
		const result = deepMerge(target, source);

		expect(result).toEqual({
			a: 1,
		}); // target unchanged

		// Test with target as null
		const result2 = deepMerge(null, {
			b: 2,
		});
		expect(result2).toEqual({
			b: 2,
		});
	});

	test("8. should handle source with primitive values", () => {
		const target = {
			a: {
				x: 1,
			},
		};
		const source = {
			a: "replaced",
		}; // replacing object with string
		const result = deepMerge(target, source);

		expect(result).toEqual({
			a: "replaced",
		});
	});

	test.each([
		{
			target: {},
			source: {},
			expected: {},
		},
		{
			target: {
				a: 1,
			},
			source: {},
			expected: {
				a: 1,
			},
		},
		{
			target: {},
			source: {
				b: 2,
			},
			expected: {
				b: 2,
			},
		},
	])("should handle empty objects ($#)", ({ target, source, expected }) => {
		expect(deepMerge(target, source)).toEqual(expected);
	});

	test("11. should preserve original objects", () => {
		const target = {
			a: {
				x: 1,
			},
			b: [
				1,
				2,
			],
		};
		const source = {
			a: {
				y: 2,
			},
			b: [
				3,
				4,
			],
		};

		const targetCopy = JSON.parse(JSON.stringify(target));
		const sourceCopy = JSON.parse(JSON.stringify(source));

		const result = deepMerge(target, source);

		// Original objects should be unchanged
		expect(target).toEqual(targetCopy);
		expect(source).toEqual(sourceCopy);

		// Result should be a new object with merged properties
		expect(result).toEqual({
			a: {
				x: 1,
				y: 2,
			},
			b: [
				3,
				4,
			],
		});
	});
});
