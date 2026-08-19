import { Data } from "#types/data";
import { findUtil } from "#utils/action";
import { describe, expect, test } from "bun:test";

const mockFileCpu = {
	find: async (_file: string, query: any): Promise<Data[]> => {
		return query.mockData || [];
	},
} as any;

describe("findUtil", () => {
	describe("min aggregation", () => {
		test.each([
			{
				dbFindOpts: {
					min: {
						minPrice: "price",
					},
				},
				mockData: [
					{
						_id: "1",
						price: 10,
					},
					{
						_id: "2",
						price: 5,
					},
					{
						_id: "3",
						price: 20,
					},
				],
				expected: [
					{
						minPrice: 5,
					},
				],
			},
			{
				dbFindOpts: {
					min: {
						minPrice: "price",
					},
				},
				mockData: [
					{
						_id: "1",
						price: undefined,
					},
					{
						_id: "2",
						price: undefined,
					},
				],
				expected: [
					{
						minPrice: null,
					},
				],
			},
			{
				dbFindOpts: {
					min: {
						minPrice: "price",
						minQty: "quantity",
					},
				},
				mockData: [
					{
						_id: "1",
						price: 10,
						quantity: 100,
					},
					{
						_id: "2",
						price: 5,
						quantity: 50,
					},
					{
						_id: "3",
						price: 20,
						quantity: 200,
					},
				],
				expected: [
					{
						minPrice: 5,
						minQty: 50,
					},
				],
			},
		])(
			"should compute min aggregation ($#)",
			async ({ dbFindOpts, mockData, expected }) => {
				const query: any = {
					dbFindOpts,
					mockData,
				};
				const result = await findUtil(query, mockFileCpu, [
					"file1",
				]);
				expect(result).toEqual(expected as any);
			},
		);
	});

	describe("max aggregation", () => {
		test.each([
			{
				dbFindOpts: {
					max: {
						maxPrice: "price",
					},
				},
				mockData: [
					{
						_id: "1",
						price: 10,
					},
					{
						_id: "2",
						price: 5,
					},
					{
						_id: "3",
						price: 20,
					},
				],
				expected: [
					{
						maxPrice: 20,
					},
				],
			},
			{
				dbFindOpts: {
					max: {
						maxPrice: "price",
					},
				},
				mockData: [
					{
						_id: "1",
						price: "not a number",
					},
					{
						_id: "2",
						price: undefined,
					},
				],
				expected: [
					{
						maxPrice: null,
					},
				],
			},
			{
				dbFindOpts: {
					max: {
						maxPrice: "price",
						maxQty: "quantity",
					},
				},
				mockData: [
					{
						_id: "1",
						price: 10,
						quantity: 100,
					},
					{
						_id: "2",
						price: 5,
						quantity: 50,
					},
					{
						_id: "3",
						price: 20,
						quantity: 200,
					},
				],
				expected: [
					{
						maxPrice: 20,
						maxQty: 200,
					},
				],
			},
		])(
			"should compute max aggregation ($#)",
			async ({ dbFindOpts, mockData, expected }) => {
				const query: any = {
					dbFindOpts,
					mockData,
				};
				const result = await findUtil(query, mockFileCpu, [
					"file1",
				]);
				expect(result).toEqual(expected as any);
			},
		);
	});

	describe("avg aggregation", () => {
		test.each([
			{
				dbFindOpts: {
					avg: {
						avgPrice: "price",
					},
				},
				mockData: [
					{
						_id: "1",
						price: 10,
					},
					{
						_id: "2",
						price: 20,
					},
					{
						_id: "3",
						price: 30,
					},
				],
				expected: [
					{
						avgPrice: 20,
					},
				],
			},
			{
				dbFindOpts: {
					avg: {
						avgPrice: "price",
					},
				},
				mockData: [
					{
						_id: "1",
						price: undefined,
					},
					{
						_id: "2",
						price: undefined,
					},
				],
				expected: [
					{
						avgPrice: null,
					},
				],
			},
			{
				dbFindOpts: {
					avg: {
						avgPrice: "price",
					},
				},
				mockData: [
					{
						_id: "1",
						price: 10,
					},
					{
						_id: "2",
						price: 15,
					},
				],
				expected: [
					{
						avgPrice: 12.5,
					},
				],
			},
		])(
			"should compute avg aggregation ($#)",
			async ({ dbFindOpts, mockData, expected }) => {
				const query: any = {
					dbFindOpts,
					mockData,
				};
				const result = await findUtil(query, mockFileCpu, [
					"file1",
				]);
				expect(result).toEqual(expected as any);
			},
		);
	});

	describe("groupBy aggregation", () => {
		test("1. should group by single field", async () => {
			const query: any = {
				dbFindOpts: {
					groupBy: "category",
				},
				mockData: [
					{
						_id: "1",
						category: "A",
						price: 10,
					},
					{
						_id: "2",
						category: "B",
						price: 20,
					},
					{
						_id: "3",
						category: "A",
						price: 15,
					},
				],
			};

			const result = await findUtil(query, mockFileCpu, [
				"file1",
			]);
			expect(result).toHaveLength(2);
			expect(result.find(r => r.category === "A")?.category).toBe("A");
			expect(result.find(r => r.category === "B")?.category).toBe("B");
		});

		test("2. should group by multiple fields", async () => {
			const query: any = {
				dbFindOpts: {
					groupBy: [
						"category",
						"type",
					],
				},
				mockData: [
					{
						_id: "1",
						category: "A",
						type: "X",
						price: 10,
					},
					{
						_id: "2",
						category: "A",
						type: "Y",
						price: 20,
					},
					{
						_id: "3",
						category: "A",
						type: "X",
						price: 15,
					},
				],
			};

			const result = await findUtil(query, mockFileCpu, [
				"file1",
			]);
			expect(result).toHaveLength(2);
		});

		test("3. should sort grouped results", async () => {
			const query: any = {
				dbFindOpts: {
					groupBy: "category",
					sortBy: "category",
					sortAsc: false,
				},
				mockData: [
					{
						_id: "1",
						category: "A",
						price: 10,
					},
					{
						_id: "2",
						category: "C",
						price: 20,
					},
					{
						_id: "3",
						category: "B",
						price: 15,
					},
				],
			};

			const result = await findUtil(query, mockFileCpu, [
				"file1",
			]);
			expect(result[0].category).toBe("C");
			expect(result[1].category).toBe("B");
			expect(result[2].category).toBe("A");
		});
	});

	describe("count aggregation", () => {
		test.each([
			{
				dbFindOpts: {
					count: {
						total: "_id",
					},
				},
				mockData: [
					{
						_id: "1",
						name: "a",
					},
					{
						_id: "2",
						name: "b",
					},
					{
						_id: "3",
						name: "c",
					},
				],
				expected: [
					{
						total: 3,
					},
				],
			},
			{
				dbFindOpts: {
					count: {
						totalCount: "_id",
					},
				},
				mockData: [
					{
						_id: "1",
						name: "a",
					},
					{
						_id: "2",
						name: "b",
					},
					{
						_id: "3",
						name: "c",
					},
				],
				expected: [
					{
						totalCount: 3,
					},
				],
			},
			{
				dbFindOpts: {
					count: {
						validCount: "price",
					},
				},
				mockData: [
					{
						_id: "1",
						price: 10,
					},
					{
						_id: "2",
					},
					{
						_id: "3",
						price: 20,
					},
				],
				expected: [
					{
						validCount: 2,
					},
				],
			},
		])(
			"should compute count aggregation ($#)",
			async ({ dbFindOpts, mockData, expected }) => {
				const query: any = {
					dbFindOpts,
					mockData,
				};
				const result = await findUtil(query, mockFileCpu, [
					"file1",
				]);
				expect(result).toEqual(expected as any);
			},
		);
	});

	describe("combined aggregations", () => {
		test("1. should combine min, max, avg", async () => {
			const query: any = {
				dbFindOpts: {
					min: {
						minPrice: "price",
					},
					max: {
						maxPrice: "price",
					},
					avg: {
						avgPrice: "price",
					},
				},
				mockData: [
					{
						_id: "1",
						price: 10,
					},
					{
						_id: "2",
						price: 20,
					},
					{
						_id: "3",
						price: 30,
					},
				],
			};

			const result = await findUtil(query, mockFileCpu, [
				"file1",
			]);
			expect(result).toEqual([
				{
					minPrice: 10,
					maxPrice: 30,
					avgPrice: 20,
				},
			]);
		});

		test("2. should combine groupBy with explicit count key", async () => {
			const query: any = {
				dbFindOpts: {
					groupBy: "category",
					count: {
						total: "_id",
					},
				},
				mockData: [
					{
						_id: "1",
						category: "A",
					},
					{
						_id: "2",
						category: "A",
					},
					{
						_id: "3",
						category: "B",
					},
				],
			};

			const result = await findUtil(query, mockFileCpu, [
				"file1",
			]);
			expect(result.find(r => r.category === "A")?.total).toBe(2);
			expect(result.find(r => r.category === "B")?.total).toBe(1);
		});

		test("3. should combine groupBy with aggregations and sortBy", async () => {
			const query: any = {
				dbFindOpts: {
					groupBy: "category",
					max: {
						maxPrice: "price",
					},
					sortBy: "maxPrice",
					sortAsc: false,
				},
				mockData: [
					{
						_id: "1",
						category: "A",
						price: 10,
					},
					{
						_id: "2",
						category: "B",
						price: 50,
					},
					{
						_id: "3",
						category: "C",
						price: 30,
					},
				],
			};

			const result = await findUtil(query, mockFileCpu, [
				"file1",
			]);
			expect(result[0].category).toBe("B");
			expect(result[0].maxPrice).toBe(50);
		});
	});

	describe("with offset and limit", () => {
		test("1. should apply offset after aggregation", async () => {
			const query: any = {
				dbFindOpts: {
					groupBy: "category",
					offset: 1,
				},
				mockData: [
					{
						_id: "1",
						category: "A",
					},
					{
						_id: "2",
						category: "B",
					},
					{
						_id: "3",
						category: "C",
					},
				],
			};

			const result = await findUtil(query, mockFileCpu, [
				"file1",
			]);
			expect(result).toHaveLength(2);
		});

		test("2. should apply limit after aggregation", async () => {
			const query: any = {
				dbFindOpts: {
					groupBy: "category",
					limit: 2,
				},
				mockData: [
					{
						_id: "1",
						category: "A",
					},
					{
						_id: "2",
						category: "B",
					},
					{
						_id: "3",
						category: "C",
					},
				],
			};

			const result = await findUtil(query, mockFileCpu, [
				"file1",
			]);
			expect(result).toHaveLength(2);
		});

		test("3. should apply both offset and limit after aggregation", async () => {
			const query: any = {
				dbFindOpts: {
					groupBy: "category",
					offset: 1,
					limit: 1,
				},
				mockData: [
					{
						_id: "1",
						category: "A",
					},
					{
						_id: "2",
						category: "B",
					},
					{
						_id: "3",
						category: "C",
					},
				],
			};

			const result = await findUtil(query, mockFileCpu, [
				"file1",
			]);
			expect(result).toHaveLength(1);
		});
	});

	describe("reverse option with aggregations", () => {
		test("1. should reverse data before aggregation", async () => {
			const query: any = {
				dbFindOpts: {
					reverse: true,
					min: {
						minPrice: "price",
					},
				},
				mockData: [
					{
						_id: "1",
						price: 10,
					},
					{
						_id: "2",
						price: 5,
					},
					{
						_id: "3",
						price: 20,
					},
				],
			};

			const result = await findUtil(query, mockFileCpu, [
				"file1",
			]);
			expect(result).toEqual([
				{
					minPrice: 5,
				},
			]);
		});
	});

	describe("reverse option with array data", () => {
		test("1. should reverse array data when reverse=true and no sortBy", async () => {
			const query: any = {
				dbFindOpts: {
					reverse: true,
				},
			};

			const data = [
				{
					_id: "1",
					val: 1,
				},
				{
					_id: "2",
					val: 2,
				},
				{
					_id: "3",
					val: 3,
				},
			];

			const result = await findUtil(query, data, [
				"",
			]);
			expect(result).toHaveLength(3);
			expect(result[0].val).toBe(3);
			expect(result[1].val).toBe(2);
			expect(result[2].val).toBe(1);
		});

		test("2. should not reverse array data when sortBy is set", async () => {
			const query: any = {
				dbFindOpts: {
					reverse: true,
					sortBy: "val",
					sortAsc: true,
				},
			};

			const data = [
				{
					_id: "1",
					val: 3,
				},
				{
					_id: "2",
					val: 1,
				},
				{
					_id: "3",
					val: 2,
				},
			];

			const result = await findUtil(query, data, [
				"",
			]);
			expect(result).toHaveLength(3);
			expect(result[0].val).toBe(1);
			expect(result[1].val).toBe(2);
			expect(result[2].val).toBe(3);
		});

		test("3. should reverse and apply offset/limit correctly", async () => {
			const query: any = {
				dbFindOpts: {
					reverse: true,
					offset: 1,
					limit: 1,
				},
			};

			const data = [
				{
					_id: "1",
					val: 1,
				},
				{
					_id: "2",
					val: 2,
				},
				{
					_id: "3",
					val: 3,
				},
				{
					_id: "4",
					val: 4,
				},
			];

			const result = await findUtil(query, data, [
				"",
			]);
			expect(result).toHaveLength(1);
			expect(result[0].val).toBe(3);
		});

		test("4. should keep original order when reverse=false", async () => {
			const query: any = {
				dbFindOpts: {
					reverse: false,
				},
			};

			const data = [
				{
					_id: "1",
					val: 1,
				},
				{
					_id: "2",
					val: 2,
				},
				{
					_id: "3",
					val: 3,
				},
			];

			const result = await findUtil(query, data, [
				"",
			]);
			expect(result).toHaveLength(3);
			expect(result[0].val).toBe(1);
			expect(result[2].val).toBe(3);
		});

		test("5. should reverse before aggregation with array data", async () => {
			const query: any = {
				dbFindOpts: {
					reverse: true,
					min: {
						minVal: "val",
					},
				},
			};

			const data = [
				{
					_id: "1",
					val: 10,
				},
				{
					_id: "2",
					val: 5,
				},
				{
					_id: "3",
					val: 20,
				},
			];

			const result = await findUtil(query, data, [
				"",
			]);
			expect(result).toEqual([
				{
					minVal: 5,
				},
			]);
		});

		test("6. should reverse empty array without errors", async () => {
			const query: any = {
				dbFindOpts: {
					reverse: true,
				},
			};

			const result = await findUtil(
				query,
				[],
				[
					"",
				],
			);
			expect(result).toEqual([]);
		});
	});

	describe("multiple files", () => {
		test("1. should aggregate across multiple files", async () => {
			const mockMultiFileCpu = {
				find: async (file: string, query: any): Promise<Data[]> => {
					if (file === "file1")
						return [
							{
								_id: "1",
								price: 10,
							},
						];
					if (file === "file2")
						return [
							{
								_id: "2",
								price: 20,
							},
						];
					return [];
				},
			} as any;

			const query: any = {
				dbFindOpts: {
					min: {
						minPrice: "price",
					},
					max: {
						maxPrice: "price",
					},
				},
			};

			const result = await findUtil(query, mockMultiFileCpu, [
				"file1",
				"file2",
			]);
			expect(result).toEqual([
				{
					minPrice: 10,
					maxPrice: 20,
				},
			]);
		});
	});

	describe("sum aggregation", () => {
		test.each([
			{
				dbFindOpts: {
					sum: {
						totalPrice: "price",
					},
				},
				mockData: [
					{
						_id: "1",
						price: 10,
					},
					{
						_id: "2",
						price: 20,
					},
					{
						_id: "3",
						price: 30,
					},
				],
				expected: [
					{
						totalPrice: 60,
					},
				],
			},
			{
				dbFindOpts: {
					sum: {
						totalPrice: "price",
					},
				},
				mockData: [
					{
						_id: "1",
						price: undefined,
					},
					{
						_id: "2",
						price: "not a number",
					},
				],
				expected: [
					{
						totalPrice: null,
					},
				],
			},
			{
				dbFindOpts: {
					sum: {
						totalPrice: "price",
						totalQty: "quantity",
					},
				},
				mockData: [
					{
						_id: "1",
						price: 10,
						quantity: 100,
					},
					{
						_id: "2",
						price: 20,
						quantity: 200,
					},
				],
				expected: [
					{
						totalPrice: 30,
						totalQty: 300,
					},
				],
			},
		])(
			"should compute sum aggregation ($#)",
			async ({ dbFindOpts, mockData, expected }) => {
				const query: any = {
					dbFindOpts,
					mockData,
				};
				const result = await findUtil(query, mockFileCpu, [
					"file1",
				]);
				expect(result).toEqual(expected as any);
			},
		);

		test("4. should combine sum with groupBy", async () => {
			const query: any = {
				dbFindOpts: {
					groupBy: "category",
					sum: {
						totalPrice: "price",
					},
				},
				mockData: [
					{
						_id: "1",
						category: "A",
						price: 10,
					},
					{
						_id: "2",
						category: "B",
						price: 20,
					},
					{
						_id: "3",
						category: "A",
						price: 15,
					},
				],
			};

			const result = await findUtil(query, mockFileCpu, [
				"file1",
			]);
			expect(result.find(r => r.category === "A")?.totalPrice).toBe(25);
			expect(result.find(r => r.category === "B")?.totalPrice).toBe(20);
		});
	});

	describe("distinct aggregation", () => {
		test("1. should return unique values for specified field", async () => {
			const query: any = {
				dbFindOpts: {
					distinct: "category",
				},
				mockData: [
					{
						_id: "1",
						category: "A",
						price: 10,
					},
					{
						_id: "2",
						category: "B",
						price: 20,
					},
					{
						_id: "3",
						category: "A",
						price: 15,
					},
					{
						_id: "4",
						category: "C",
						price: 25,
					},
				],
			};

			const result = await findUtil(query, mockFileCpu, [
				"file1",
			]);
			expect(result).toHaveLength(3);
			expect(result.map(r => r.category).sort()).toEqual([
				"A",
				"B",
				"C",
			]);
		});

		test("2. should handle distinct after groupBy with aggregation", async () => {
			const query: any = {
				dbFindOpts: {
					groupBy: "category",
					distinct: "category",
					sum: {
						totalPrice: "price",
					},
				},
				mockData: [
					{
						_id: "1",
						category: "A",
						price: 10,
					},
					{
						_id: "2",
						category: "A",
						price: 20,
					},
					{
						_id: "3",
						category: "B",
						price: 30,
					},
				],
			};

			const result = await findUtil(query, mockFileCpu, [
				"file1",
			]);
			expect(result).toHaveLength(2);
		});

		test("3. should handle distinct with complex values", async () => {
			const query: any = {
				dbFindOpts: {
					distinct: "tags",
				},
				mockData: [
					{
						_id: "1",
						tags: [
							"a",
							"b",
						],
					},
					{
						_id: "2",
						tags: [
							"a",
							"b",
						],
					},
					{
						_id: "3",
						tags: [
							"c",
						],
					},
				],
			};

			const result = await findUtil(query, mockFileCpu, [
				"file1",
			]);
			expect(result).toHaveLength(2);
		});
	});

	describe("multi-sort", () => {
		test("1. should sort by multiple fields", async () => {
			const query: any = {
				dbFindOpts: {
					sortBy: [
						{
							field: "category",
							asc: true,
						},
						{
							field: "price",
							asc: false,
						},
					],
				},
				mockData: [
					{
						_id: "1",
						category: "A",
						price: 10,
					},
					{
						_id: "2",
						category: "B",
						price: 20,
					},
					{
						_id: "3",
						category: "A",
						price: 15,
					},
					{
						_id: "4",
						category: "B",
						price: 25,
					},
				],
			};

			const result = await findUtil(query, mockFileCpu, [
				"file1",
			]);
			expect(result[0].category).toBe("A");
			expect(result[0].price).toBe(15);
			expect(result[1].category).toBe("A");
			expect(result[1].price).toBe(10);
			expect(result[2].category).toBe("B");
			expect(result[2].price).toBe(25);
			expect(result[3].category).toBe("B");
			expect(result[3].price).toBe(20);
		});

		test("2. should handle mixed asc/desc sorting", async () => {
			const query: any = {
				dbFindOpts: {
					sortBy: [
						{
							field: "status",
							asc: true,
						},
						{
							field: "createdAt",
							asc: false,
						},
					],
				},
				mockData: [
					{
						_id: "1",
						status: "active",
						createdAt: 100,
					},
					{
						_id: "2",
						status: "inactive",
						createdAt: 200,
					},
					{
						_id: "3",
						status: "active",
						createdAt: 150,
					},
				],
			};

			const result = await findUtil(query, mockFileCpu, [
				"file1",
			]);
			expect(result[0].status).toBe("active");
			expect(result[0].createdAt).toBe(150);
			expect(result[1].status).toBe("active");
			expect(result[1].createdAt).toBe(100);
			expect(result[2].status).toBe("inactive");
		});

		test("3. should maintain backward compatibility with single sortBy", async () => {
			const query: any = {
				dbFindOpts: {
					sortBy: "price",
					sortAsc: false,
				},
				mockData: [
					{
						_id: "1",
						price: 10,
					},
					{
						_id: "2",
						price: 30,
					},
					{
						_id: "3",
						price: 20,
					},
				],
			};

			const result = await findUtil(query, mockFileCpu, [
				"file1",
			]);
			expect(result[0].price).toBe(30);
			expect(result[1].price).toBe(20);
			expect(result[2].price).toBe(10);
		});

		test("4. should handle multi-sort with ties (secondary sort resolves ties)", async () => {
			const query: any = {
				dbFindOpts: {
					sortBy: [
						{
							field: "category",
							asc: true,
						},
						{
							field: "price",
							asc: true,
						},
					],
				},
				mockData: [
					{
						_id: "1",
						category: "A",
						price: 20,
					},
					{
						_id: "2",
						category: "A",
						price: 10,
					},
					{
						_id: "3",
						category: "A",
						price: 20,
					},
				],
			};

			const result = await findUtil(query, mockFileCpu, [
				"file1",
			]);
			expect(result[0].price).toBe(10);
			expect(result[1].price).toBe(20);
			expect(result[2].price).toBe(20);
		});
	});

	describe("offset and limit with multiple files", () => {
		test("1. should apply offset across multiple files", async () => {
			const mockMultiFileCpu = {
				find: async (file: string, query: any): Promise<Data[]> => {
					if (file === "file1")
						return [
							{
								_id: "1",
							},
							{
								_id: "2",
							},
						];
					if (file === "file2")
						return [
							{
								_id: "3",
							},
							{
								_id: "4",
							},
						];
					return [];
				},
			} as any;

			const query: any = {
				dbFindOpts: {
					offset: 1,
				},
			};

			const result = await findUtil(query, mockMultiFileCpu, [
				"file1",
				"file2",
			]);
			expect(result).toHaveLength(3);
			expect(result[0]._id).toBe("2");
		});

		test("2. should apply limit across multiple files", async () => {
			const mockMultiFileCpu = {
				find: async (file: string, query: any): Promise<Data[]> => {
					if (file === "file1")
						return [
							{
								_id: "1",
							},
							{
								_id: "2",
							},
						];
					if (file === "file2")
						return [
							{
								_id: "3",
							},
							{
								_id: "4",
							},
						];
					return [];
				},
			} as any;

			const query: any = {
				dbFindOpts: {
					limit: 3,
				},
			};

			const result = await findUtil(query, mockMultiFileCpu, [
				"file1",
				"file2",
			]);
			expect(result).toHaveLength(3);
		});

		test("3. should skip entire file when offset exceeds file length", async () => {
			const mockMultiFileCpu = {
				find: async (file: string, query: any): Promise<Data[]> => {
					if (file === "file1")
						return [
							{
								_id: "1",
							},
						];
					if (file === "file2")
						return [
							{
								_id: "2",
							},
							{
								_id: "3",
							},
						];
					return [];
				},
			} as any;

			const query: any = {
				dbFindOpts: {
					offset: 1,
				},
			};

			const result = await findUtil(query, mockMultiFileCpu, [
				"file1",
				"file2",
			]);
			expect(result).toHaveLength(2);
			expect(result[0]._id).toBe("2");
		});
	});
});
