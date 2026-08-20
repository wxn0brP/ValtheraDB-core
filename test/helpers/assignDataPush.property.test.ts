import fc from "fast-check";
import { assignDataPush } from "#helpers/assignDataPush";
import { describe, expect, test } from "bun:test";

describe("assignDataPush - property-based", () => {
	test("non-object inputs always return empty object", () => {
		fc.assert(
			fc.property(
				fc.oneof(
					fc.integer(),
					fc.string(),
					fc.boolean(),
					fc.constant(null),
					fc.constant(undefined),
				),
				input => {
					expect(assignDataPush(input)).toEqual({});
				},
			),
		);
	});

	test("arrays return empty object", () => {
		fc.assert(
			fc.property(fc.array(fc.integer()), arr => {
				expect(assignDataPush(arr)).toEqual({});
			}),
		);
	});

	test("empty object returns empty object", () => {
		expect(assignDataPush({})).toEqual({});
	});

	test("non-$ prefixed keys are preserved as-is", () => {
		fc.assert(
			fc.property(
				fc.dictionary(
					fc
						.string({
							minLength: 1,
						})
						.filter(s => !s.startsWith("$") && s !== "__proto__" && s !== "constructor" && s !== "prototype"),
					fc.oneof(fc.integer(), fc.string(), fc.boolean()),
					{
						minKeys: 1,
						maxKeys: 5,
					},
				),
				data => {
					const result = assignDataPush(data);
					expect(result).toEqual(data);
				},
			),
		);
	});

	test("$set operator extracts its properties", () => {
		fc.assert(
			fc.property(
				fc.dictionary(
					fc
						.string({
							minLength: 1,
						})
						.filter(
							s =>
								!s.startsWith("$") &&
								s !== "__proto__" &&
								s !== "constructor" &&
								s !== "prototype",
						),
					fc.oneof(fc.integer(), fc.string()),
					{
						minKeys: 1,
						maxKeys: 5,
					},
				),
				fields => {
					const result = assignDataPush({
						$set: fields,
					});
					expect(result).toEqual(fields);
				},
			),
		);
	});

	test("$inc operator extracts its properties", () => {
		fc.assert(
			fc.property(
				fc.dictionary(
					fc
						.string({
							minLength: 1,
						})
						.filter(s => !s.startsWith("$")),
					fc.integer(),
					{
						minKeys: 1,
						maxKeys: 5,
					},
				),
				fields => {
					const result = assignDataPush({
						$inc: fields,
					});
					expect(result).toEqual(fields);
				},
			),
		);
	});

	test("$ operator with array value is skipped", () => {
		fc.assert(
			fc.property(
				fc.array(fc.integer(), {
					minLength: 1,
				}),
				arr => {
					const result = assignDataPush({
						$push: arr,
					});
					expect(result).toEqual({});
				},
			),
		);
	});

	test("mixed $ and non-$ keys are combined in result", () => {
		fc.assert(
			fc.property(
				fc.dictionary(
					fc
						.string({
							minLength: 1,
						})
						.filter(s => !s.startsWith("$") && s !== "__proto__" && s !== "constructor" && s !== "prototype"),
					fc.oneof(fc.integer(), fc.string()),
					{
						minKeys: 1,
						maxKeys: 3,
					},
				),
				fc.dictionary(
					fc
						.string({
							minLength: 1,
						})
						.filter(s => !s.startsWith("$") && s !== "__proto__" && s !== "constructor" && s !== "prototype"),
					fc.oneof(fc.integer(), fc.string()),
					{
						minKeys: 1,
						maxKeys: 3,
					},
				),
				(nonDollar, dollarFields) => {
					const result = assignDataPush({
						...nonDollar,
						$set: dollarFields,
					});
					const expected = {
						...nonDollar,
						...dollarFields,
					};
					expect(result).toEqual(expected);
				},
			),
		);
	});

	test("multiple $ operators are all extracted", () => {
		fc.assert(
			fc.property(
				fc.dictionary(
					fc
						.string({
							minLength: 1,
						})
						.filter(s => !s.startsWith("$") && s !== "__proto__" && s !== "constructor" && s !== "prototype"),
					fc.integer(),
					{
						minKeys: 1,
						maxKeys: 3,
					},
				),
				fc.dictionary(
					fc
						.string({
							minLength: 1,
						})
						.filter(s => !s.startsWith("$") && s !== "__proto__" && s !== "constructor" && s !== "prototype"),
					fc.integer(),
					{
						minKeys: 1,
						maxKeys: 3,
					},
				),
				(setFields, incFields) => {
					const result = assignDataPush({
						$set: setFields,
						$inc: incFields,
					});
					const expected = {
						...setFields,
						...incFields,
					};
					expect(result).toEqual(expected);
				},
			),
		);
	});
});
