import { describe, test, expect } from "bun:test";
import { convertIdToUnix, sortByIds, compareIds } from "#utils/id";

describe("convertIdToUnix", () => {
    test("should convert base36 timestamp to unix timestamp", () => {
        // Create a simple ID with known timestamp in base36
        const timestamp = 1672531200; // Jan 1, 2023
        const base36Time = timestamp.toString(36);
        const id = `${base36Time}-abc123`;

        expect(convertIdToUnix(id)).toBe(timestamp);
    });

    test("should handle IDs with multiple parts separated by hyphens", () => {
        const timestamp = 1680000000;
        const base36Time = timestamp.toString(36);
        const id = `${base36Time}-part1-part2`;

        expect(convertIdToUnix(id)).toBe(timestamp);
    });

    test("should handle minimal valid ID format", () => {
        const timestamp = 12345;
        const base36Time = timestamp.toString(36);
        const id = `${base36Time}-x`;

        expect(convertIdToUnix(id)).toBe(timestamp);
    });
});

describe("sortByIds", () => {
    test("should sort objects by their _id property chronologically", () => {
        const id1 = "1gc1302w-1"; // corresponds to a timestamp
        const id2 = "1gc1303x-2"; // a later timestamp
        const id3 = "1gc1301k-3"; // an earlier timestamp

        const objects = [
            { _id: id2, name: "second" },
            { _id: id3, name: "first" },
            { _id: id1, name: "middle" }
        ];

        const sorted = sortByIds(objects);
        expect(sorted).toEqual([
            { _id: id3, name: "first" },
            { _id: id1, name: "middle" },
            { _id: id2, name: "second" }
        ]);
    });

    test("should return a new array without modifying the original", () => {
        const id1 = "1gc1302w-1";
        const id2 = "1gc1303x-2";
        const originalArray = [
            { _id: id2, name: "second" },
            { _id: id1, name: "first" }
        ];

        const originalCopy = [...originalArray];
        const sorted = sortByIds(originalArray);

        expect(originalArray).toEqual(originalCopy); // original unchanged
        expect(sorted[0]._id).toBe(id1); // sorted correctly
    });

    test("should handle single element array", () => {
        const id = "1gc1302w-1";
        const objects = [{ _id: id, name: "single" }];

        const sorted = sortByIds(objects);
        expect(sorted).toEqual([{ _id: id, name: "single" }]);
    });

    test("should handle empty array", () => {
        const sorted = sortByIds([]);
        expect(sorted).toEqual([]);
    });
});

describe("compareIds", () => {
    test("should compare two string IDs by timestamp part", () => {
        const id1 = "1gc1302w-1";
        const id2 = "1gc1303x-2";

        expect(compareIds(id1, id2)).toBeLessThan(0); // id1 is earlier
        expect(compareIds(id2, id1)).toBeGreaterThan(0); // id2 is later
        expect(compareIds(id1, id1)).toBe(0); // same id
    });

    test("should lexicographically compare if timestamps are equal", () => {
        const id1 = "1gc1302w-aaa";
        const id2 = "1gc1302w-zzz";

        expect(compareIds(id1, id2)).toBeLessThan(0); // id1 comes first lexicographically
        expect(compareIds(id2, id1)).toBeGreaterThan(0); // id2 comes after
    });

    test("should compare two number IDs", () => {
        expect(compareIds(5, 10)).toBeLessThan(0);
        expect(compareIds(10, 5)).toBeGreaterThan(0);
        expect(compareIds(5, 5)).toBe(0);
    });

    test("should compare mixed number and string IDs", () => {
        expect(compareIds(1672531200, "1gc1302w-1")).toBeLessThan(0); // assuming string ID represents a later time
        expect(compareIds("1gc1302w-1", 1672531200)).toBeGreaterThan(0);
        expect(compareIds(1672531200, "1gc1302w-later")).toBeLessThan(0); // if string represents later time
    });
});