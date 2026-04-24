import { describe, test, expect } from "bun:test";
import { Data } from "#types/data";
import { findUtil } from "#utils/action";

const mockFileCpu = {
    find: async (_file: string, query: any): Promise<Data[]> => {
        return query.mockData || [];
    }
} as any;

describe("findUtil", () => {
    describe("min aggregation", () => {
        test("1. should return minimum value for specified field", async () => {
            const query: any = {
                dbFindOpts: { min: { minPrice: "price" } },
                mockData: [
                    { _id: "1", price: 10 },
                    { _id: "2", price: 5 },
                    { _id: "3", price: 20 }
                ]
            };

            const result = await findUtil(query, mockFileCpu, ["file1"]);
            expect(result).toEqual([{ minPrice: 5 }]);
        });

        test("2. should return null when no valid numeric values", async () => {
            const query: any = {
                dbFindOpts: { min: { minPrice: "price" } },
                mockData: [
                    { _id: "1", price: undefined },
                    { _id: "2", price: undefined }
                ]
            };

            const result = await findUtil(query, mockFileCpu, ["file1"]);
            expect(result).toEqual([{ minPrice: null }]);
        });

        test("3. should handle multiple min fields", async () => {
            const query: any = {
                dbFindOpts: { min: { minPrice: "price", minQty: "quantity" } },
                mockData: [
                    { _id: "1", price: 10, quantity: 100 },
                    { _id: "2", price: 5, quantity: 50 },
                    { _id: "3", price: 20, quantity: 200 }
                ]
            };

            const result = await findUtil(query, mockFileCpu, ["file1"]);
            expect(result).toEqual([{ minPrice: 5, minQty: 50 }]);
        });
    });

    describe("max aggregation", () => {
        test("1. should return maximum value for specified field", async () => {
            const query: any = {
                dbFindOpts: { max: { maxPrice: "price" } },
                mockData: [
                    { _id: "1", price: 10 },
                    { _id: "2", price: 5 },
                    { _id: "3", price: 20 }
                ]
            };

            const result = await findUtil(query, mockFileCpu, ["file1"]);
            expect(result).toEqual([{ maxPrice: 20 }]);
        });

        test("2. should return null when no valid numeric values", async () => {
            const query: any = {
                dbFindOpts: { max: { maxPrice: "price" } },
                mockData: [
                    { _id: "1", price: "not a number" },
                    { _id: "2", price: undefined }
                ]
            };

            const result = await findUtil(query, mockFileCpu, ["file1"]);
            expect(result).toEqual([{ maxPrice: null }]);
        });

        test("3. should handle multiple max fields", async () => {
            const query: any = {
                dbFindOpts: { max: { maxPrice: "price", maxQty: "quantity" } },
                mockData: [
                    { _id: "1", price: 10, quantity: 100 },
                    { _id: "2", price: 5, quantity: 50 },
                    { _id: "3", price: 20, quantity: 200 }
                ]
            };

            const result = await findUtil(query, mockFileCpu, ["file1"]);
            expect(result).toEqual([{ maxPrice: 20, maxQty: 200 }]);
        });
    });

    describe("avg aggregation", () => {
        test("1. should return average value for specified field", async () => {
            const query: any = {
                dbFindOpts: { avg: { avgPrice: "price" } },
                mockData: [
                    { _id: "1", price: 10 },
                    { _id: "2", price: 20 },
                    { _id: "3", price: 30 }
                ]
            };

            const result = await findUtil(query, mockFileCpu, ["file1"]);
            expect(result[0].avgPrice).toBe(20);
        });

        test("2. should return null when no valid numeric values", async () => {
            const query: any = {
                dbFindOpts: { avg: { avgPrice: "price" } },
                mockData: [
                    { _id: "1", price: undefined },
                    { _id: "2", price: undefined }
                ]
            };

            const result = await findUtil(query, mockFileCpu, ["file1"]);
            expect(result).toEqual([{ avgPrice: null }]);
        });

        test("3. should handle floats correctly", async () => {
            const query: any = {
                dbFindOpts: { avg: { avgPrice: "price" } },
                mockData: [
                    { _id: "1", price: 10 },
                    { _id: "2", price: 15 }
                ]
            };

            const result = await findUtil(query, mockFileCpu, ["file1"]);
            expect(result[0].avgPrice).toBe(12.5);
        });
    });

    describe("groupBy aggregation", () => {
        test("1. should group by single field", async () => {
            const query: any = {
                dbFindOpts: { groupBy: "category" },
                mockData: [
                    { _id: "1", category: "A", price: 10 },
                    { _id: "2", category: "B", price: 20 },
                    { _id: "3", category: "A", price: 15 }
                ]
            };

            const result = await findUtil(query, mockFileCpu, ["file1"]);
            expect(result).toHaveLength(2);
            expect(result.find(r => r.category === "A")?.category).toBe("A");
            expect(result.find(r => r.category === "B")?.category).toBe("B");
        });

        test("2. should group by multiple fields", async () => {
            const query: any = {
                dbFindOpts: { groupBy: ["category", "type"] },
                mockData: [
                    { _id: "1", category: "A", type: "X", price: 10 },
                    { _id: "2", category: "A", type: "Y", price: 20 },
                    { _id: "3", category: "A", type: "X", price: 15 }
                ]
            };

            const result = await findUtil(query, mockFileCpu, ["file1"]);
            expect(result).toHaveLength(2);
        });

        test("3. should sort grouped results", async () => {
            const query: any = {
                dbFindOpts: { groupBy: "category", sortBy: "category", sortAsc: false },
                mockData: [
                    { _id: "1", category: "A", price: 10 },
                    { _id: "2", category: "C", price: 20 },
                    { _id: "3", category: "B", price: 15 }
                ]
            };

            const result = await findUtil(query, mockFileCpu, ["file1"]);
            expect(result[0].category).toBe("C");
            expect(result[1].category).toBe("B");
            expect(result[2].category).toBe("A");
        });
    });

    describe("count aggregation", () => {
test("1. should count all records with explicit key", async () => {
        const query: any = {
            dbFindOpts: { count: { total: "_id" } },
            mockData: [
                { _id: "1", name: "a" },
                { _id: "2", name: "b" },
                { _id: "3", name: "c" }
            ]
        };

        const result = await findUtil(query, mockFileCpu, ["file1"]);
        expect(result).toEqual([{ total: 3 }]);
    });

        test("2. should count with custom output key", async () => {
            const query: any = {
                dbFindOpts: { count: { totalCount: "_id" } },
                mockData: [
                    { _id: "1", name: "a" },
                    { _id: "2", name: "b" },
                    { _id: "3", name: "c" }
                ]
            };

            const result = await findUtil(query, mockFileCpu, ["file1"]);
            expect(result).toEqual([{ totalCount: 3 }]);
        });

        test("3. should count only records with defined field", async () => {
            const query: any = {
                dbFindOpts: { count: { validCount: "price" } },
                mockData: [
                    { _id: "1", price: 10 },
                    { _id: "2" },
                    { _id: "3", price: 20 }
                ]
            };

            const result = await findUtil(query, mockFileCpu, ["file1"]);
            expect(result).toEqual([{ validCount: 2 }]);
        });
    });

    describe("combined aggregations", () => {
        test("1. should combine min, max, avg", async () => {
            const query: any = {
                dbFindOpts: {
                    min: { minPrice: "price" },
                    max: { maxPrice: "price" },
                    avg: { avgPrice: "price" }
                },
                mockData: [
                    { _id: "1", price: 10 },
                    { _id: "2", price: 20 },
                    { _id: "3", price: 30 }
                ]
            };

            const result = await findUtil(query, mockFileCpu, ["file1"]);
            expect(result).toEqual([{ minPrice: 10, maxPrice: 30, avgPrice: 20 }]);
        });

test("2. should combine groupBy with explicit count key", async () => {
        const query: any = {
            dbFindOpts: { groupBy: "category", count: { total: "_id" } },
            mockData: [
                { _id: "1", category: "A" },
                { _id: "2", category: "A" },
                { _id: "3", category: "B" }
            ]
        };

        const result = await findUtil(query, mockFileCpu, ["file1"]);
        expect(result.find(r => r.category === "A")?.total).toBe(2);
        expect(result.find(r => r.category === "B")?.total).toBe(1);
    });

        test("3. should combine groupBy with aggregations and sortBy", async () => {
            const query: any = {
                dbFindOpts: {
                    groupBy: "category",
                    max: { maxPrice: "price" },
                    sortBy: "maxPrice",
                    sortAsc: false
                },
                mockData: [
                    { _id: "1", category: "A", price: 10 },
                    { _id: "2", category: "B", price: 50 },
                    { _id: "3", category: "C", price: 30 }
                ]
            };

            const result = await findUtil(query, mockFileCpu, ["file1"]);
            expect(result[0].category).toBe("B");
            expect(result[0].maxPrice).toBe(50);
        });
    });

    describe("with offset and limit", () => {
        test("1. should apply offset after aggregation", async () => {
            const query: any = {
                dbFindOpts: { groupBy: "category", offset: 1 },
                mockData: [
                    { _id: "1", category: "A" },
                    { _id: "2", category: "B" },
                    { _id: "3", category: "C" }
                ]
            };

            const result = await findUtil(query, mockFileCpu, ["file1"]);
            expect(result).toHaveLength(2);
        });

        test("2. should apply limit after aggregation", async () => {
            const query: any = {
                dbFindOpts: { groupBy: "category", limit: 2 },
                mockData: [
                    { _id: "1", category: "A" },
                    { _id: "2", category: "B" },
                    { _id: "3", category: "C" }
                ]
            };

            const result = await findUtil(query, mockFileCpu, ["file1"]);
            expect(result).toHaveLength(2);
        });

        test("3. should apply both offset and limit after aggregation", async () => {
            const query: any = {
                dbFindOpts: { groupBy: "category", offset: 1, limit: 1 },
                mockData: [
                    { _id: "1", category: "A" },
                    { _id: "2", category: "B" },
                    { _id: "3", category: "C" }
                ]
            };

            const result = await findUtil(query, mockFileCpu, ["file1"]);
            expect(result).toHaveLength(1);
        });
    });

    describe("reverse option with aggregations", () => {
        test("1. should reverse data before aggregation", async () => {
            const query: any = {
                dbFindOpts: { reverse: true, min: { minPrice: "price" } },
                mockData: [
                    { _id: "1", price: 10 },
                    { _id: "2", price: 5 },
                    { _id: "3", price: 20 }
                ]
            };

            const result = await findUtil(query, mockFileCpu, ["file1"]);
            expect(result).toEqual([{ minPrice: 5 }]);
        });
    });

    describe("multiple files", () => {
        test("1. should aggregate across multiple files", async () => {
            const mockMultiFileCpu = {
                find: async (file: string, query: any): Promise<Data[]> => {
                    if (file === "file1") return [{ _id: "1", price: 10 }];
                    if (file === "file2") return [{ _id: "2", price: 20 }];
                    return [];
                }
            } as any;

            const query: any = {
                dbFindOpts: { min: { minPrice: "price" }, max: { maxPrice: "price" } }
            };

            const result = await findUtil(query, mockMultiFileCpu, ["file1", "file2"]);
            expect(result).toEqual([{ minPrice: 10, maxPrice: 20 }]);
        });
    });
});
