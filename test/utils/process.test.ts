import { Data } from "#types/data";
import { VQuery } from "#types/query";
import { findObj, matchObj, updateObj } from "#utils/process";
import { describe, expect, test } from "bun:test";

describe("matchObj", () => {
	test("1. should return true for empty search", () => {
		const config: VQuery = {
			collection: "users",
			search: {},
		};
		const obj = {
			_id: "1",
			name: "John",
		};
		expect(matchObj(config, obj)).toBe(true);
	});

	test("2. should return true when search object matches", () => {
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

	test("3. should return false when search object does not match", () => {
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
});
