import { hasFields } from "#utils/hasFields";
import { describe, expect, test } from "bun:test";

describe("hasFields", () => {
	test("1. should return true for empty fields", () => {
		expect(hasFields({}, {})).toBe(true);
	});

	test.each([
		{
			obj: {
				a: 5,
				b: 10,
			},
			fields: {
				a: 5,
			},
			expected: true,
		},
		{
			obj: {
				a: 5,
				b: 10,
			},
			fields: {
				a: 5,
				b: 10,
			},
			expected: true,
		},
		{
			obj: {
				a: 5,
				b: 10,
			},
			fields: {
				a: 6,
			},
			expected: false,
		},
		{
			obj: {
				a: 5,
				b: 10,
			},
			fields: {
				a: 5,
				b: 11,
			},
			expected: false,
		},
		{
			obj: {
				a: 5,
				b: 10,
			},
			fields: {
				c: 5,
			},
			expected: false,
		},
		{
			obj: {
				a: 5,
			},
			fields: {
				b: 5,
			},
			expected: false,
		},
		{
			obj: {
				a: 5,
			},
			fields: {
				a: 5,
				b: 10,
			},
			expected: false,
		},
	])("should match fields correctly ($#)", ({ obj, fields, expected }) => {
		expect(hasFields(obj, fields)).toBe(expected);
	});

	test.each([
		{
			fields: {
				string: "hello",
			},
			expected: true,
		},
		{
			fields: {
				number: 42,
			},
			expected: true,
		},
		{
			fields: {
				boolean: true,
			},
			expected: true,
		},
		{
			fields: {
				nullValue: null,
			},
			expected: true,
		},
		{
			fields: {
				string: "world",
			},
			expected: false,
		},
		{
			fields: {
				number: 41,
			},
			expected: false,
		},
		{
			fields: {
				boolean: false,
			},
			expected: false,
		},
		{
			fields: {
				nullValue: undefined,
			},
			expected: false,
		},
	])(
		"should handle different data types correctly ($#)",
		({ fields, expected }) => {
			const obj = {
				string: "hello",
				number: 42,
				boolean: true,
				nullValue: null,
			};
			expect(hasFields(obj, fields)).toBe(expected);
		},
	);

	test("6. should handle nested objects", () => {
		const obj = {
			a: {
				b: {
					c: 5,
				},
			},
			d: 10,
		};

		expect(
			hasFields(obj, {
				a: {
					b: {
						c: 5,
					},
				},
			}),
		).toBe(true);
		expect(
			hasFields(obj, {
				a: {
					b: {
						c: 6,
					},
				},
			}),
		).toBe(false);
		expect(
			hasFields(obj, {
				a: {
					b: {
						c: 5,
						d: 7,
					},
				},
			}),
		).toBe(false);
		expect(
			hasFields(obj, {
				d: 10,
			}),
		).toBe(true);
	});

	test("7. should return false for nested objects when nested field doesn't match", () => {
		const obj = {
			a: {
				b: 5,
			},
		};

		expect(
			hasFields(obj, {
				a: {
					b: 5,
				},
			}),
		).toBe(true);
		expect(
			hasFields(obj, {
				a: {
					b: 6,
				},
			}),
		).toBe(false);
		expect(
			hasFields(obj, {
				a: {
					c: 5,
				},
			}),
		).toBe(false); // c doesn't exist in obj.a
	});

	test("8. should handle arrays as values", () => {
		const obj = {
			arr: [
				1,
				2,
				3,
			],
			nested: {
				arr: [
					"a",
					"b",
					"c",
				],
			},
		};

		expect(
			hasFields(obj, {
				arr: [
					1,
					2,
					3,
				],
			}),
		).toBe(true);
		expect(
			hasFields(obj, {
				arr: [
					1,
					2,
					4,
				],
			}),
		).toBe(false);
		expect(
			hasFields(obj, {
				nested: {
					arr: [
						"a",
						"b",
						"c",
					],
				},
			}),
		).toBe(true);
		expect(
			hasFields(obj, {
				nested: {
					arr: [
						"a",
						"b",
						"d",
					],
				},
			}),
		).toBe(false);
	});

	test.each([
		{
			fields: {
				nullField: null,
			},
			expected: true,
		},
		{
			fields: {
				zero: 0,
			},
			expected: true,
		},
		{
			fields: {
				emptyString: "",
			},
			expected: true,
		},
		{
			fields: {
				falseValue: false,
			},
			expected: true,
		},
		{
			fields: {
				nullField: undefined,
			},
			expected: false,
		},
		{
			fields: {
				zero: false,
			},
			expected: false,
		},
		{
			fields: {
				emptyString: false,
			},
			expected: false,
		},
	])(
		"should handle null and undefined values properly ($#)",
		({ fields, expected }) => {
			const obj = {
				nullField: null,
				zero: 0,
				emptyString: "",
				falseValue: false,
			};
			expect(hasFields(obj, fields)).toBe(expected);
		},
	);

	test("10. should distinguish between objects and primitive values", () => {
		const obj = {
			obj: {
				value: "test",
			},
			primitive: 123,
		};

		expect(
			hasFields(obj, {
				obj: {
					value: "test",
				},
			}),
		).toBe(true);
		expect(
			hasFields(obj, {
				primitive: 123,
			}),
		).toBe(true);
		expect(
			hasFields(obj, {
				obj: 123,
			}),
		).toBe(false);
		expect(
			hasFields(obj, {
				primitive: {
					value: "test",
				},
			}),
		).toBe(false);
	});

	test("11. should handle deeply nested structures", () => {
		const obj = {
			level1: {
				level2: {
					level3: {
						value: "deep",
					},
				},
			},
		};

		expect(
			hasFields(obj, {
				level1: {
					level2: {
						level3: {
							value: "deep",
						},
					},
				},
			}),
		).toBe(true);
		expect(
			hasFields(obj, {
				level1: {
					level2: {
						level3: {
							value: "shallow",
						},
					},
				},
			}),
		).toBe(false);
	});

	test("12. should handle objects with same values but different key order", () => {
		const obj = {
			a: 1,
			b: 2,
		};
		// The function only checks if the field values match, not the ordering
		expect(
			hasFields(obj, {
				b: 2,
				a: 1,
			}),
		).toBe(true);
	});

	test("13. should return true when checking for empty object in nested structure", () => {
		const obj = {
			a: {},
		};
		expect(
			hasFields(obj, {
				a: {},
			}),
		).toBe(true);
	});
});
