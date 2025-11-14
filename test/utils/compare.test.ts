import { describe, test, expect } from "bun:test";
import { compareSafe } from "#utils/compare";

describe("compareSafe", () => {
    test("should handle null and undefined values correctly", () => {
        expect(compareSafe(null, null)).toBe(0);
        expect(compareSafe(undefined, undefined)).toBe(0);
        expect(compareSafe(null, undefined)).toBe(0);
        expect(compareSafe(null, "test")).toBe(1);  // null comes after non-null
        expect(compareSafe("test", null)).toBe(-1); // non-null comes before null
        expect(compareSafe(undefined, "test")).toBe(1);
        expect(compareSafe("test", undefined)).toBe(-1);
    });

    test("should compare strings correctly", () => {
        expect(compareSafe("a", "b")).toBeLessThan(0);
        expect(compareSafe("b", "a")).toBeGreaterThan(0);
        expect(compareSafe("a", "a")).toBe(0);
        expect(compareSafe("hello", "world")).toBeLessThan(0);
        expect(compareSafe("world", "hello")).toBeGreaterThan(0);
    });

    test("should compare numbers correctly", () => {
        expect(compareSafe(1, 2)).toBeLessThan(0);
        expect(compareSafe(2, 1)).toBeGreaterThan(0);
        expect(compareSafe(1, 1)).toBe(0);
        expect(compareSafe(-5, 5)).toBeLessThan(0);
        expect(compareSafe(0, 0)).toBe(0);
    });

    test("should compare dates correctly", () => {
        const date1 = new Date("2023-01-01");
        const date2 = new Date("2023-12-31");
        expect(compareSafe(date1, date2)).toBeLessThan(0);
        expect(compareSafe(date2, date1)).toBeGreaterThan(0);
        expect(compareSafe(date1, new Date("2023-01-01"))).toBe(0);
    });

    test("should compare number with date correctly", () => {
        const timestamp = 1672531200000; // Jan 1, 2023 timestamp
        const date = new Date(timestamp);
        expect(compareSafe(timestamp, date)).toBe(0);
        expect(compareSafe(timestamp, new Date(timestamp + 86400000))).toBeLessThan(0); // 86400000ms = 1 day
    });

    test("should compare booleans correctly", () => {
        expect(compareSafe(false, true)).toBeLessThan(0);
        expect(compareSafe(true, false)).toBeGreaterThan(0);
        expect(compareSafe(false, false)).toBe(0);
        expect(compareSafe(true, true)).toBe(0);
    });

    test("should return 0 when comparing different types", () => {
        expect(compareSafe(1, "string")).toBe(0);
        expect(compareSafe("string", 1)).toBe(0);
        expect(compareSafe(1, false)).toBe(0);
        expect(compareSafe(true, "string")).toBe(0);
        expect(compareSafe([], {})).toBe(0);  // objects/arrays fallback to 0
    });

    test("should handle object comparisons (fallback)", () => {
        const obj1 = { a: 1 };
        const obj2 = { b: 2 };
        expect(compareSafe(obj1, obj2)).toBe(0); // objects fallback to 0
    });

    test("should handle arrays (fallback)", () => {
        const arr1 = [1, 2, 3];
        const arr2 = [4, 5, 6];
        expect(compareSafe(arr1, arr2)).toBe(0); // arrays fallback to 0
    });

    test("should handle complex comparisons", () => {
        // Mixed type comparisons should return 0
        expect(compareSafe(42, {})).toBe(0);
        expect(compareSafe([], "string")).toBe(0);
        expect(compareSafe(new Date(), false)).toBe(0);
    });
});