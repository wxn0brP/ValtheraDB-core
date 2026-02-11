import { describe, test, expect } from "bun:test";
import { assignDataPush, setDataForUpdateOneOrAdd, setDataForToggleOne } from "#helpers/assignDataPush";
import { VQuery } from "#types/query";

describe("assignDataPush", () => {
    test("1. should return empty object when data is null or undefined", () => {
        expect(assignDataPush(null)).toEqual({});
        expect(assignDataPush(undefined)).toEqual({});
    });

    test("2. should return empty object when data is not an object", () => {
        expect(assignDataPush("string")).toEqual({});
        expect(assignDataPush(123)).toEqual({});
        expect(assignDataPush(true)).toEqual({});
    });

    test("3. should return empty object when data is an array", () => {
        expect(assignDataPush([1, 2, 3])).toEqual({});
    });

    test("4. should return empty object when data is an empty object", () => {
        expect(assignDataPush({})).toEqual({});
    });

    test("5. should return non-$ prefixed properties as-is", () => {
        const result = assignDataPush({ name: "John", age: 30 });
        expect(result).toEqual({ name: "John", age: 30 });
    });

    test("6. should extract properties from $set operator", () => {
        const result = assignDataPush({ $set: { name: "John", age: 30 } });
        expect(result).toEqual({ name: "John", age: 30 });
    });

    test("7. should extract properties from multiple operators", () => {
        const result = assignDataPush({
            $set: { name: "John" },
            $inc: { age: 1 },
            nonPrefixed: "value"
        });
        expect(result).toEqual({ name: "John", age: 1, nonPrefixed: "value" });
    });

    test("8. should skip array values in operators", () => {
        const result = assignDataPush({ $push: [1, 2, 3] });
        expect(result).toEqual({});
    });

    test("9. should handle mixed prefixed and non-prefixed properties", () => {
        const result = assignDataPush({
            name: "John",
            $set: { age: 30 },
            $unset: { email: "" }
        });
        expect(result).toEqual({ name: "John", age: 30, email: "" });
    });
});

describe("setDataForUpdateOneOrAdd", () => {
    test("1. should set data property combining search, updater, and add_arg", () => {
        const query: VQuery = {
            search: { name: "John" },
            updater: { $set: { age: 30 } },
            add_arg: { createdAt: new Date() }
        };

        setDataForUpdateOneOrAdd(query);

        expect(query.data).toBeDefined();
        expect(query.data.name).toBe("John"); // from search
        expect(query.data.age).toBe(30); // from updater
        expect(query.data.createdAt).toBeDefined(); // from add_arg
    });
});

describe("setDataForToggleOne", () => {
    test("1. should set data property combining search and data", () => {
        const query: VQuery = {
            search: { name: "John" },
            data: { $set: { active: true } }
        };

        setDataForToggleOne(query);

        expect(query.data).toBeDefined();
        expect(query.data.name).toBe("John"); // from search
        expect(query.data.active).toBe(true); // from original data
    });
});