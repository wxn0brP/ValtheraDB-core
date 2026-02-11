import { genId, getIdData } from "#helpers/gen";
import { describe, expect, test } from "bun:test";

describe("getIdData", () => {
    test("1. should return an object with required properties", () => {
        const idData = getIdData();

        expect(idData).toHaveProperty("usedIds");
        expect(idData).toHaveProperty("lastId");
        expect(idData).toHaveProperty("recentIdsTimestamps");
        expect(idData).toHaveProperty("startIndex");
        expect(idData).toHaveProperty("lastGeneratedMs");
        expect(idData).toHaveProperty("lastRandomValue");

        expect(idData.usedIds).toBeInstanceOf(Map);
        expect(Array.isArray(idData.recentIdsTimestamps)).toBe(true);
        expect(idData.lastId).toBeUndefined();
    });
});

describe("genId", () => {
    test("1. should generate a unique ID with default parts [1,1]", () => {
        const id = genId();

        expect(typeof id).toBe("string");
        // Should have the format: timestamp-part1-part2
        const parts = id.split("-");
        expect(parts).toHaveLength(3); // time, part1, part2
    });

    test("2. should generate IDs with custom parts schema", () => {
        const id = genId([2, 3]);

        expect(typeof id).toBe("string");
        const parts = id.split("-");
        // Should have the format: timestamp-part1-part2
        expect(parts).toHaveLength(3);
        // Second and third parts should have lengths 2 and 3 respectively
        expect(parts[1]).toHaveLength(2);
        expect(parts[2]).toHaveLength(3);
    });

    test("3. should generate different IDs on subsequent calls", () => {
        const id1 = genId();
        const id2 = genId();

        expect(id1).not.toBe(id2);
    });

    test("4. should generate unique IDs using custom IdData", () => {
        const idData = getIdData();
        const id1 = genId([1, 1], idData);
        const id2 = genId([1, 1], idData);

        expect(id1).not.toBe(id2);
        expect(typeof id1).toBe("string");
        expect(typeof id2).toBe("string");
    });

    test("5. should handle rapid ID generation without conflicts", () => {
        const idData = getIdData();
        const ids = [];

        for (let i = 0; i < 10; i++) {
            ids.push(genId([1, 1], idData));
        }

        // All IDs should be unique
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(10);
    });
});