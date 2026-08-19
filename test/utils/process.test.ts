import { Data } from "#types/data";
import { VQuery } from "#types/query";
import { findObj, matchObj, updateObj } from "#utils/process";
import { describe, expect, test } from "bun:test";

describe("matchObj", () => {
	test("1. should return true when search is undefined", () => {
		const config: VQuery = {
			collection: "users",
			search: undefined,
		};
		const obj = {
			_id: "1",
			name: "John",
		};
		expect(matchObj(config, obj)).toBe(true);
	});

	test("2. should return true when search is null", () => {
		const config: VQuery = {
			collection: "users",
			search: null,
		};
		const obj = {
			_id: "1",
			name: "John",
		};
		expect(matchObj(config, obj)).toBe(true);
	});

	test("3. should return true when search function returns true", () => {
		const config: VQuery = {
			collection: "users",
			search: (obj: any) => obj.name === "John",
		};
		const obj = {
			_id: "1",
			name: "John",
		};
		expect(matchObj(config, obj)).toBe(true);
	});

	test("4. should return false when search function returns false", () => {
		const config: VQuery = {
			collection: "users",
			search: (obj: any) => obj.name === "Jane",
		};
		const obj = {
			_id: "1",
			name: "John",
		};
		expect(matchObj(config, obj)).toBe(false);
	});

	test("5. should return true when search object matches", () => {
		const config: VQuery = {
			collection: "users",
			search: {
				name: "John",
			},
		};
		const obj = {
			_id: "1",
			name: "John",
		};
		expect(matchObj(config, obj)).toBe(true);
	});

	test("6. should return false when search object does not match", () => {
		const config: VQuery = {
			collection: "users",
			search: {
				name: "Jane",
			},
		};
		const obj = {
			_id: "1",
			name: "John",
		};
		expect(matchObj(config, obj)).toBe(false);
	});

	test("7. should return false when search is array", () => {
		const config: VQuery = {
			collection: "users",
			search: [
				1,
				2,
				3,
			] as any,
		};
		const obj = {
			_id: "1",
			name: "John",
		};
		expect(matchObj(config, obj)).toBe(false);
	});
});

describe("findObj", () => {
	test("1. should return null when object does not match", () => {
		const config: VQuery = {
			collection: "users",
			search: {
				name: "Jane",
			},
		};
		const obj = {
			_id: "1",
			name: "John",
		};
		expect(findObj(config as any, obj)).toBeNull();
	});

	test("2. should return object with findOpts applied when matches", () => {
		const config: VQuery = {
			collection: "users",
			search: {
				name: "John",
			},
			findOpts: {
				select: [
					"name",
				],
			},
		};
		const obj = {
			_id: "1",
			name: "John",
			age: 30,
		};
		const result = findObj(config as any, obj);
		expect(result).toEqual({
			name: "John",
		});
	});

	test("3. should return object without findOpts when not specified", () => {
		const config: VQuery = {
			collection: "users",
			search: {
				name: "John",
			},
		};
		const obj = {
			_id: "1",
			name: "John",
			age: 30,
		};
		const result = findObj(config as any, obj);
		expect(result).toEqual(obj);
	});
});

describe("updateObj", () => {
	test("1. should update object with updater object", () => {
		const config: VQuery = {
			collection: "users",
			updater: {
				$set: {
					name: "Jane",
				},
			},
		};
		const obj: Data = {
			_id: "1",
			name: "John",
		};
		const result = updateObj(config as any, obj);
		expect(result.name).toBe("Jane");
	});

	test("2. should update object with updater function returning value", () => {
		const config: VQuery = {
			collection: "users",
			updater: (obj: any) => ({
				...obj,
				name: "Jane",
			}),
		};
		const obj: Data = {
			_id: "1",
			name: "John",
		};
		const result = updateObj(config as any, obj);
		expect(result.name).toBe("Jane");
	});

	test("3. should return original object when updater function returns void", () => {
		const config: VQuery = {
			collection: "users",
			updater: (obj: any) => {
				obj.name = "Jane";
			},
		};
		const obj: Data = {
			_id: "1",
			name: "John",
		};
		const result = updateObj(config as any, obj);
		expect(result.name).toBe("Jane");
		expect(result).toBe(obj);
	});

	test("4. should return original object when updater is array", () => {
		const config: VQuery = {
			collection: "users",
			updater: [
				1,
				2,
				3,
			] as any,
		};
		const obj: Data = {
			_id: "1",
			name: "John",
		};
		const result = updateObj(config as any, obj);
		expect(result).toBe(obj);
	});

	test("5. should pass context to updater function", () => {
		const config: VQuery = {
			collection: "users",
			context: {
				userId: "123",
			},
			updater: (obj: any, context: any) => ({
				...obj,
				updatedBy: context.userId,
			}),
		};
		const obj: Data = {
			_id: "1",
			name: "John",
		};
		const result = updateObj(config as any, obj);
		expect(result.updatedBy).toBe("123");
	});
});
