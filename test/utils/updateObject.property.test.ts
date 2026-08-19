import fc from "fast-check";
import { updateObjectAdvanced } from "#utils/updateObject";
import { describe, expect, test } from "bun:test";

describe("updateObjectAdvanced - property-based", () => {
	test("$inc then $dec with same value restores original", () => {
		fc.assert(
			fc.property(
				fc.integer(),
				fc.integer({
					min: 1,
					max: 1000,
				}),
				(initial, delta) => {
					const obj = {
						num: initial,
					};
					updateObjectAdvanced(obj, {
						$inc: {
							num: delta,
						},
					});
					updateObjectAdvanced(obj, {
						$dec: {
							num: delta,
						},
					});
					expect(obj.num).toBe(initial);
				},
			),
		);
	});

	test("$set is idempotent", () => {
		fc.assert(
			fc.property(fc.integer(), fc.integer(), (_initial, value) => {
				const obj = {
					a: _initial,
				};
				updateObjectAdvanced(obj, {
					$set: {
						a: value,
					},
				});
				const afterFirst = {
					...obj,
				};
				updateObjectAdvanced(obj, {
					$set: {
						a: value,
					},
				});
				expect(obj).toEqual(afterFirst);
			}),
		);
	});

	test("$set overwrites the value", () => {
		fc.assert(
			fc.property(fc.integer(), fc.integer(), (initial, value) => {
				const obj = {
					a: initial,
				};
				updateObjectAdvanced(obj, {
					$set: {
						a: value,
					},
				});
				expect(obj.a).toBe(value);
			}),
		);
	});

	test("$rename preserves the value under new key", () => {
		fc.assert(
			fc.property(
				fc.string({
					minLength: 1,
					maxLength: 5,
				}),
				fc.string({
					minLength: 1,
					maxLength: 5,
				}),
				fc.oneof(fc.integer(), fc.string()),
				(oldKey, newKey, value) => {
					if (oldKey === newKey) return true;
					const obj: Record<string, any> = {
						[oldKey]: value,
					};
					updateObjectAdvanced(obj, {
						$rename: {
							[oldKey]: newKey,
						},
					});
					expect(obj[newKey]).toEqual(value);
					expect(oldKey in obj).toBe(false);
				},
			),
		);
	});

	test("$unset removes the key", () => {
		fc.assert(
			fc.property(
				fc.string({
					minLength: 1,
					maxLength: 5,
				}),
				fc.integer(),
				(key, value) => {
					const obj: Record<string, any> = {
						[key]: value,
					};
					updateObjectAdvanced(obj, {
						$unset: {
							[key]: 1,
						},
					});
					expect(key in obj).toBe(false);
				},
			),
		);
	});

	test("$push then $pull restores original array (single occurrence)", () => {
		fc.assert(
			fc.property(
				fc.array(
					fc.integer().filter(n => n !== 999),
					{
						minLength: 0,
						maxLength: 10,
					},
				),
				arr => {
					const original = [
						...arr,
					];
					const obj = {
						arr: [
							...arr,
						],
					};
					updateObjectAdvanced(obj, {
						$push: {
							arr: 999,
						},
					});
					expect(obj.arr).toEqual([
						...original,
						999,
					]);
					updateObjectAdvanced(obj, {
						$pull: {
							arr: 999,
						},
					});
					expect(obj.arr).toEqual(original);
				},
			),
		);
	});

	test("$push adds element to end of array", () => {
		fc.assert(
			fc.property(
				fc.array(fc.integer(), {
					minLength: 0,
					maxLength: 10,
				}),
				fc.integer(),
				(arr, val) => {
					const obj = {
						arr: [
							...arr,
						],
					};
					updateObjectAdvanced(obj, {
						$push: {
							arr: val,
						},
					});
					expect(obj.arr).toEqual([
						...arr,
						val,
					]);
				},
			),
		);
	});

	test("$pullAll removes all specified elements", () => {
		fc.assert(
			fc.property(
				fc.array(fc.integer(), {
					minLength: 1,
					maxLength: 10,
				}),
				fc.array(fc.integer(), {
					minLength: 1,
					maxLength: 5,
				}),
				(arr, toRemove) => {
					const obj = {
						arr: [
							...arr,
						],
					};
					updateObjectAdvanced(obj, {
						$pullAll: {
							arr: toRemove,
						},
					});
					for (const val of toRemove) {
						expect(obj.arr).not.toContain(val);
					}
				},
			),
		);
	});

	test("empty update does not change object", () => {
		fc.assert(
			fc.property(
				fc.dictionary(
					fc.string({
						minLength: 1,
					}),
					fc.integer(),
				),
				data => {
					const obj = {
						...data,
					};
					const copy = {
						...data,
					};
					updateObjectAdvanced(obj, {});
					expect(obj).toEqual(copy);
				},
			),
		);
	});

	test("non-$ keys are directly assigned", () => {
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
						maxKeys: 3,
					},
				),
				fields => {
					const obj: Record<string, any> = {};
					updateObjectAdvanced(obj, fields);
					for (const [k, v] of Object.entries(fields)) {
						expect(obj[k]).toBe(v);
					}
				},
			),
		);
	});

	test("$inc adds correct numeric value", () => {
		fc.assert(
			fc.property(fc.integer(), fc.integer(), (initial, delta) => {
				const obj = {
					num: initial,
				};
				updateObjectAdvanced(obj, {
					$inc: {
						num: delta,
					},
				});
				expect(obj.num).toBe(initial + delta);
			}),
		);
	});

	test("$dec subtracts correct numeric value", () => {
		fc.assert(
			fc.property(fc.integer(), fc.integer(), (initial, delta) => {
				const obj = {
					num: initial,
				};
				updateObjectAdvanced(obj, {
					$dec: {
						num: delta,
					},
				});
				expect(obj.num).toBe(initial - delta);
			}),
		);
	});
});
