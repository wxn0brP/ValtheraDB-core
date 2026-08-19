import fc from "fast-check";
import { hasFieldsAdvanced } from "#utils/hasFieldsAdvanced";
import { describe, expect, test } from "bun:test";

describe("hasFieldsAdvanced - property-based", () => {
	test("empty fields always match", () => {
		fc.assert(
			fc.property(fc.dictionary(fc.string(), fc.integer()), obj => {
				expect(hasFieldsAdvanced(obj, {})).toBe(true);
			}),
		);
	});

	test("double negation: $not($not(filter)) === filter", () => {
		fc.assert(
			fc.property(fc.integer(), fc.integer(), (val, threshold) => {
				const obj = {
					a: val,
				};
				const filter = {
					$gt: {
						a: threshold,
					},
				};
				const direct = hasFieldsAdvanced(obj, filter);
				const doubleNeg = hasFieldsAdvanced(obj, {
					$not: {
						$not: filter,
					},
				});
				expect(doubleNeg).toBe(direct);
			}),
		);
	});

	test("$gt and $lte are complementary for same type", () => {
		fc.assert(
			fc.property(fc.integer(), fc.integer(), (val, threshold) => {
				const obj = {
					a: val,
				};
				const gt = hasFieldsAdvanced(obj, {
					$gt: {
						a: threshold,
					},
				});
				const lte = hasFieldsAdvanced(obj, {
					$lte: {
						a: threshold,
					},
				});
				expect(gt).toBe(!lte);
			}),
		);
	});

	test("$lt and $gte are complementary for same type", () => {
		fc.assert(
			fc.property(fc.integer(), fc.integer(), (val, threshold) => {
				const obj = {
					a: val,
				};
				const lt = hasFieldsAdvanced(obj, {
					$lt: {
						a: threshold,
					},
				});
				const gte = hasFieldsAdvanced(obj, {
					$gte: {
						a: threshold,
					},
				});
				expect(lt).toBe(!gte);
			}),
		);
	});

	test("$in with single element equals direct equality", () => {
		fc.assert(
			fc.property(fc.integer(), fc.integer(), (val, target) => {
				const obj = {
					a: val,
				};
				const inResult = hasFieldsAdvanced(obj, {
					$in: {
						a: [
							target,
						],
					},
				});
				const eqResult = hasFieldsAdvanced(obj, {
					a: target,
				});
				expect(inResult).toBe(eqResult);
			}),
		);
	});

	test("$nin is negation of $in", () => {
		fc.assert(
			fc.property(
				fc.integer(),
				fc.array(fc.integer(), {
					minLength: 1,
					maxLength: 10,
				}),
				(val, arr) => {
					const obj = {
						a: val,
					};
					const inResult = hasFieldsAdvanced(obj, {
						$in: {
							a: arr,
						},
					});
					const ninResult = hasFieldsAdvanced(obj, {
						$nin: {
							a: arr,
						},
					});
					expect(ninResult).toBe(!inResult);
				},
			),
		);
	});

	test("$between [v, v] equals direct equality for numbers", () => {
		fc.assert(
			fc.property(fc.integer(), fc.integer(), (val, target) => {
				const obj = {
					a: val,
				};
				const between = hasFieldsAdvanced(obj, {
					$between: {
						a: [
							target,
							target,
						],
					},
				});
				const eq = hasFieldsAdvanced(obj, {
					a: target,
				});
				expect(between).toBe(eq);
			}),
		);
	});

	test("$ne is negation of direct equality", () => {
		fc.assert(
			fc.property(fc.integer(), fc.integer(), (val, target) => {
				const obj = {
					a: val,
				};
				const ne = hasFieldsAdvanced(obj, {
					$ne: {
						a: target,
					},
				});
				const eq = hasFieldsAdvanced(obj, {
					a: target,
				});
				expect(ne).toBe(!eq);
			}),
		);
	});

	test("$and with single element equals that element", () => {
		fc.assert(
			fc.property(fc.integer(), fc.integer(), (val, threshold) => {
				const obj = {
					a: val,
				};
				const filter = {
					$gt: {
						a: threshold,
					},
				};
				const single = hasFieldsAdvanced(obj, filter);
				const andResult = hasFieldsAdvanced(obj, {
					$and: [
						filter,
					],
				});
				expect(andResult).toBe(single);
			}),
		);
	});

	test("$or with single element equals that element", () => {
		fc.assert(
			fc.property(fc.integer(), fc.integer(), (val, threshold) => {
				const obj = {
					a: val,
				};
				const filter = {
					$gt: {
						a: threshold,
					},
				};
				const single = hasFieldsAdvanced(obj, filter);
				const orResult = hasFieldsAdvanced(obj, {
					$or: [
						filter,
					],
				});
				expect(orResult).toBe(single);
			}),
		);
	});

	test("$type matches typeof check", () => {
		fc.assert(
			fc.property(fc.integer(), val => {
				const obj = {
					a: val,
				};
				expect(
					hasFieldsAdvanced(obj, {
						$type: {
							a: "number",
						},
					}),
				).toBe(true);
				expect(
					hasFieldsAdvanced(obj, {
						$type: {
							a: "string",
						},
					}),
				).toBe(false);
			}),
		);
	});

	test("$size matches array length", () => {
		fc.assert(
			fc.property(
				fc.array(fc.integer(), {
					minLength: 0,
					maxLength: 20,
				}),
				arr => {
					const obj = {
						a: arr,
					};
					expect(
						hasFieldsAdvanced(obj, {
							$size: {
								a: arr.length,
							},
						}),
					).toBe(true);
					if (arr.length > 0) {
						expect(
							hasFieldsAdvanced(obj, {
								$size: {
									a: arr.length - 1,
								},
							}),
						).toBe(false);
					}
				},
			),
		);
	});

	test("$startsWith implies string begins with value", () => {
		fc.assert(
			fc.property(fc.string(), fc.string(), (prefix, suffix) => {
				const str = prefix + suffix;
				const obj = {
					text: str,
				};
				expect(
					hasFieldsAdvanced(obj, {
						$startsWith: {
							text: prefix,
						},
					}),
				).toBe(true);
			}),
		);
	});

	test("$endsWith implies string ends with value", () => {
		fc.assert(
			fc.property(fc.string(), fc.string(), (prefix, suffix) => {
				const str = prefix + suffix;
				const obj = {
					text: str,
				};
				expect(
					hasFieldsAdvanced(obj, {
						$endsWith: {
							text: suffix,
						},
					}),
				).toBe(true);
			}),
		);
	});

	test("De Morgan: $not($and([a, b])) === $or([$not(a), $not(b)])", () => {
		fc.assert(
			fc.property(fc.integer(), fc.integer(), fc.integer(), (val, t1, t2) => {
				const obj = {
					a: val,
				};
				const f1 = {
					$gt: {
						a: t1,
					},
				};
				const f2 = {
					$gt: {
						a: t2,
					},
				};
				const deMorganAnd = hasFieldsAdvanced(obj, {
					$not: {
						$and: [
							f1,
							f2,
						],
					},
				});
				const deMorganOr = hasFieldsAdvanced(obj, {
					$or: [
						{
							$not: f1,
						},
						{
							$not: f2,
						},
					],
				});
				expect(deMorganAnd).toBe(deMorganOr);
			}),
		);
	});
});
