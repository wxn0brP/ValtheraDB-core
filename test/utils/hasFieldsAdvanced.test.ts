import { describe, test, expect } from "bun:test";
import { hasFieldsAdvanced } from "#utils/hasFieldsAdvanced";

describe("hasFieldsAdvanced", () => {
    test("1. should return true for empty fields", () => {
        expect(hasFieldsAdvanced({}, {})).toBe(true);
    });

    test("2. should throw error for non-object fields", () => {
        expect(() => hasFieldsAdvanced({}, null)).toThrow("Fields must be an object");
        // @ts-expect-error
        expect(() => hasFieldsAdvanced({}, "string")).toThrow("Fields must be an object");
        // @ts-expect-error
        expect(() => hasFieldsAdvanced({}, 123)).toThrow("Fields must be an object");
    });

    test("3. should handle $and operator", () => {
        const obj = { a: 5, b: 10 };
        expect(
            hasFieldsAdvanced(obj, {
                $and: [
                    { a: 5 },
                    { b: 10 }
                ]
            })
        ).toBe(true);

        expect(
            hasFieldsAdvanced(obj, {
                $and: [
                    { a: 5 },
                    { b: 20 }
                ]
            })
        ).toBe(false);
    });

    test("4. should handle $or operator", () => {
        const obj = { a: 5, b: 10 };
        expect(
            hasFieldsAdvanced(obj, {
                $or: [
                    { a: 6 },
                    { b: 10 }
                ]
            })
        ).toBe(true);

        expect(
            hasFieldsAdvanced(obj, {
                $or: [
                    { a: 6 },
                    { b: 8 }
                ]
            })
        ).toBe(false);
    });

    test("5. should handle $gt operator", () => {
        const obj = { a: 10, b: 5 };
        expect(hasFieldsAdvanced(obj, { $gt: { a: 5 } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $gt: { a: 15 } })).toBe(false);
    });

    test("6. should handle $lt operator", () => {
        const obj = { a: 10, b: 5 };
        expect(hasFieldsAdvanced(obj, { $lt: { a: 15 } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $lt: { a: 5 } })).toBe(false);
    });

    test("7. should handle $gte operator", () => {
        const obj = { a: 10, b: 5 };
        expect(hasFieldsAdvanced(obj, { $gte: { a: 10 } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $gte: { a: 9 } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $gte: { a: 11 } })).toBe(false);
    });

    test("8. should handle $lte operator", () => {
        const obj = { a: 10, b: 5 };
        expect(hasFieldsAdvanced(obj, { $lte: { a: 10 } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $lte: { a: 11 } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $lte: { a: 9 } })).toBe(false);
    });

    test("9. should handle $in operator", () => {
        const obj = { a: 5, b: "hello" };
        expect(hasFieldsAdvanced(obj, { $in: { a: [1, 2, 5] } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $in: { a: [1, 2, 3] } })).toBe(false);
    });

    test("10. should handle $nin operator", () => {
        const obj = { a: 5, b: "hello" };
        expect(hasFieldsAdvanced(obj, { $nin: { a: [1, 2, 7] } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $nin: { a: [1, 2, 5] } })).toBe(false);
    });

    test("11. should handle $type operator", () => {
        const obj = { a: 5, b: "hello", c: true };
        expect(hasFieldsAdvanced(obj, { $type: { a: "number" } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $type: { b: "string" } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $type: { c: "boolean" } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $type: { a: "string" } })).toBe(false);
    });

    test("12. should handle $exists operator", () => {
        const obj = { a: 5, b: undefined };
        expect(hasFieldsAdvanced(obj, { $exists: { a: true } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $exists: { c: false } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $exists: { a: false } })).toBe(false);
        expect(hasFieldsAdvanced(obj, { $exists: { c: true } })).toBe(false);
    });

    test("13. should handle $regex operator", () => {
        const obj = { text: "hello world" };
        expect(hasFieldsAdvanced(obj, { $regex: { text: "hello" } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $regex: { text: "^hello" } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $regex: { text: "goodbye" } })).toBe(false);
    });

    test("14. should handle $size operator", () => {
        const obj = { arr: [1, 2, 3], str: "abc" };
        expect(hasFieldsAdvanced(obj, { $size: { arr: 3 } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $size: { str: 3 } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $size: { arr: 2 } })).toBe(false);
    });

    test("15. should handle $startsWith operator", () => {
        const obj = { text: "hello world" };
        expect(hasFieldsAdvanced(obj, { $startsWith: { text: "hello" } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $startsWith: { text: "world" } })).toBe(false);
    });

    test("16. should handle $endsWith operator", () => {
        const obj = { text: "hello world" };
        expect(hasFieldsAdvanced(obj, { $endsWith: { text: "world" } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $endsWith: { text: "hello" } })).toBe(false);
    });

    test("17. should handle $between operator", () => {
        const obj = { num: 10 };
        expect(hasFieldsAdvanced(obj, { $between: { num: [5, 15] } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $between: { num: [15, 20] } })).toBe(false);
    });

    test("18. should handle $arrinc operator", () => {
        const obj = { arr: [1, 2, 3] };
        expect(hasFieldsAdvanced(obj, { $arrinc: { arr: [2, 4] } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $arrinc: { arr: [4, 5] } })).toBe(false);
    });

    test("19. should handle $arrincall operator", () => {
        const obj = { arr: [1, 2, 3] };
        expect(hasFieldsAdvanced(obj, { $arrincall: { arr: [1, 2] } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $arrincall: { arr: [1, 4] } })).toBe(false);
    });

    test("20. should handle $not operator", () => {
        const obj = { a: 5, b: 10 };
        expect(hasFieldsAdvanced(obj, { $not: { a: 10 } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $not: { a: 5 } })).toBe(false);
    });

    test("21. should handle $subset operator", () => {
        const obj = { a: 5, b: 10, c: 15 };
        expect(hasFieldsAdvanced(obj, { $subset: { a: 5, b: 10 } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $subset: { a: 5, b: 20 } })).toBe(false);
    });

    test("22. should combine multiple operators", () => {
        const obj = { a: 10, b: "hello", c: [1, 2, 3] };
        expect(
            hasFieldsAdvanced(obj, {
                $gt: { a: 5 },
                $startsWith: { b: "he" },
                $size: { c: 3 }
            })
        ).toBe(true);

        expect(
            hasFieldsAdvanced(obj, {
                $gt: { a: 15 },
                $startsWith: { b: "he" },
                $size: { c: 3 }
            })
        ).toBe(false);
    });

    test("23. should handle complex nested conditions", () => {
        const obj = { a: 10, b: "hello", c: [1, 2, 3] };
        expect(
            hasFieldsAdvanced(obj, {
                $or: [
                    {
                        $gt: { a: 5 },
                        $startsWith: { b: "he" }
                    },
                    {
                        $size: { c: 2 }
                    }
                ]
            })
        ).toBe(true);

        expect(
            hasFieldsAdvanced(obj, {
                $and: [
                    {
                        $gt: { a: 5 },
                        $startsWith: { b: "he" }
                    },
                    {
                        $size: { c: 2 }
                    }
                ]
            })
        ).toBe(false);
    });

    test("24. should handle deep checks for nested object comparisons", () => {
        const obj = {
            user: {
                profile: {
                    age: 25,
                    address: {
                        city: "New York",
                        zip: 10001
                    }
                }
            }
        };

        // Test deep equality
        expect(hasFieldsAdvanced(obj, { user: { profile: { age: 25 } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { user: { profile: { age: 30 } } })).toBe(false);

        // Test deep nested structure
        expect(hasFieldsAdvanced(obj, { user: { profile: { address: { city: "New York" } } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { user: { profile: { address: { zip: 10001 } } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { user: { profile: { address: { city: "Boston" } } } })).toBe(false);
    });

    test("25. should handle deep operator checks with nested objects", () => {
        const obj = {
            a: {
                b: {
                    c: 10,
                    nested: { value: 5 }
                }
            },
            d: 20
        };

        // Deep comparison with operators - nested objects inside operator fields
        expect(hasFieldsAdvanced(obj, { $gt: { a: { b: { c: 5 } } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $lt: { a: { b: { c: 15 } } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $gte: { a: { b: { c: 10 } } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $lte: { a: { b: { c: 10 } } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $in: { a: { b: { c: [8, 9, 10] } } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $nin: { a: { b: { c: [1, 2, 3] } } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $type: { a: { b: { c: "number" } } } })).toBe(true);
    });

    test("26. should handle deep checks with $exists operator - but note limitations", () => {
        const obj = {
            a: {
                b: {
                    c: 5,
                    d: undefined
                }
            }
        };

        // Note: $exists checks keys in the top-level object, not nested paths
        // This is a limitation of the current implementation
        expect(hasFieldsAdvanced(obj, { $exists: { a: true } })).toBe(true); // 'a' exists in obj
        expect(hasFieldsAdvanced(obj, { $exists: { a: false } })).toBe(false); // 'a' exists but should not
        expect(hasFieldsAdvanced(obj, { $exists: { z: false } })).toBe(true); // 'z' doesn't exist and shouldn't
    });

    test("27. should handle deep checks with $regex operator and nested objects", () => {
        const obj = {
            user: {
                profile: {
                    email: "john@example.com",
                    description: "Software developer"
                }
            }
        };

        expect(hasFieldsAdvanced(obj, { $regex: { user: { profile: { email: "example" } } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $regex: { user: { profile: { email: "^john" } } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $regex: { user: { profile: { description: "developer" } } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $regex: { user: { profile: { email: "test" } } } })).toBe(false);
    });

    test("28. should handle deep checks with $size operator and nested objects", () => {
        const obj = {
            data: {
                items: [1, 2, 3],
                text: "hello"
            }
        };

        expect(hasFieldsAdvanced(obj, { $size: { data: { items: 3 } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $size: { data: { text: 5 } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $size: { data: { items: 2 } } })).toBe(false);
    });

    test("29. should handle deep checks with $not operator and nested objects", () => {
        const obj = {
            a: { b: { c: 10 } },
            d: 20
        };

        expect(hasFieldsAdvanced(obj, { $not: { a: { b: { c: 15 } } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $not: { a: { b: { c: 10 } } } })).toBe(false);
        expect(hasFieldsAdvanced(obj, { $not: { $gt: { a: { b: { c: 15 } } } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $not: { $gt: { a: { b: { c: 5 } } } } })).toBe(false);
    });

    test("30. should handle deep checks with complex nested objects and operators", () => {
        const obj = {
            level1: {
                level2: {
                    level3: {
                        value: 42,
                        items: [1, 2, 3],
                        nested: {
                            deep: true
                        }
                    }
                }
            },
            simple: "value"
        };

        expect(hasFieldsAdvanced(obj, { $gt: { level1: { level2: { level3: { value: 40 } } } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $size: { level1: { level2: { level3: { items: 3 } } } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { level1: { level2: { level3: { nested: { deep: true } } } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { simple: "value" })).toBe(true);
    });

    test("31. should handle deep checks with null and undefined values in nested structures", () => {
        const obj = {
            a: {
                b: {
                    c: null,
                    d: undefined,
                    e: "exists"
                }
            },
            f: 5
        };

        // Direct nested object equality check (not using operators)
        // Note: Properties explicitly set to undefined are not matched by hasFields
        expect(hasFieldsAdvanced(obj, { a: { b: { c: null } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { a: { b: { e: "exists" } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { a: { b: { c: null, e: "exists" } } })).toBe(true);

        // Properties set to undefined can't be matched by hasFields (due to implementation)
        // This demonstrates a limitation of the current implementation
        expect(hasFieldsAdvanced(obj, { a: { b: { d: "anything" } } })).toBe(false);
    });

    test("32. should handle deep checks with $between operator and nested objects", () => {
        const obj = {
            data: {
                score: 85
            }
        };

        expect(hasFieldsAdvanced(obj, { $between: { data: { score: [80, 90] } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $between: { data: { score: [90, 100] } } })).toBe(false);
    });

    test("33. should handle deep checks with $startsWith and $endsWith operators and nested objects", () => {
        const obj = {
            user: {
                name: "John Doe"
            }
        };

        expect(hasFieldsAdvanced(obj, { $startsWith: { user: { name: "John" } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $endsWith: { user: { name: "Doe" } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $startsWith: { user: { name: "Jane" } } })).toBe(false);
        expect(hasFieldsAdvanced(obj, { $endsWith: { user: { name: "Smith" } } })).toBe(false);
    });

    test("34. should handle deep checks with array inclusion operators and nested objects", () => {
        const obj = {
            data: {
                tags: ["javascript", "typescript", "node"]
            }
        };

        expect(hasFieldsAdvanced(obj, { $arrinc: { data: { tags: ["typescript"] } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $arrinc: { data: { tags: ["python"] } } })).toBe(false);
        expect(hasFieldsAdvanced(obj, { $arrincall: { data: { tags: ["javascript", "typescript"] } } })).toBe(true);
        expect(hasFieldsAdvanced(obj, { $arrincall: { data: { tags: ["javascript", "python"] } } })).toBe(false);
    });

    test("35. should handle mixed shallow and deep operations", () => {
        const obj = {
            a: { b: { c: 10 } },
            d: 20,
            e: "test"
        };

        // Both shallow and deep conditions should pass
        expect(hasFieldsAdvanced(obj, {
            $gt: { a: { b: { c: 5 } } },
            $lt: { d: 25 },
            e: "test"
        })).toBe(true);

        // One deep condition fails
        expect(hasFieldsAdvanced(obj, {
            $gt: { a: { b: { c: 15 } } },
            $lt: { d: 25 },
            e: "test"
        })).toBe(false);

        // One shallow condition fails
        expect(hasFieldsAdvanced(obj, {
            $gt: { a: { b: { c: 5 } } },
            $lt: { d: 15 },
            e: "test"
        })).toBe(false);
    });
});