import { ValtheraClass } from "#db/valthera";
import { MemoryAction } from "#db/memory";
import { SmartExecutor } from "#helpers/executor";
import { describe, expect, test } from "bun:test";

class TransactionalMemoryAction extends MemoryAction {
	async beginTransaction(id: string) {
		return {
			id,
		};
	}

	async commitTransaction(handle: { id: string }) {
		// No-op for testing
	}

	async rollbackTransaction(handle: { id: string }) {
		// No-op for testing
	}
}

function createTransactionalValthera() {
	const executor = new SmartExecutor(5 * 60 * 1000, true);
	return new ValtheraClass({
		adapter: new TransactionalMemoryAction(),
		executor,
	});
}

describe("ValtheraClass.transaction", () => {
	test("1. should execute operations within a transaction and commit", async () => {
		const db = createTransactionalValthera();
		await db.init();

		const result = await db.transaction(
			[
				"users",
			],
			async tx => {
				const usersCol = tx.c("users");
				await usersCol.add({
					name: "Alice",
					age: 25,
				});
				await usersCol.add({
					name: "Bob",
					age: 30,
				});
				return "committed";
			},
		);

		expect(result).toBe("committed");

		const users = await db.c("users").find();
		expect(users).toHaveLength(2);
	});

	test("2. should rollback on error and throw the original error", async () => {
		const db = createTransactionalValthera();
		await db.init();

		try {
			await db.transaction(
				[
					"users",
				],
				async tx => {
					const usersCol = tx.c("users");
					await usersCol.add({
						name: "Alice",
					});
					throw new Error("Test error");
				},
			);
			expect.unreachable("Should have thrown");
		} catch (err: any) {
			expect(err.message).toBe("Test error");
		}
	});

	test("3. should throw AggregateError if both transaction and rollback fail", async () => {
		class FailingRollbackAction extends TransactionalMemoryAction {
			async rollbackTransaction(handle: { id: string }) {
				throw new Error("Rollback failed");
			}
		}

		const db = new ValtheraClass({
			adapter: new FailingRollbackAction(),
		});
		await db.init();

		try {
			await db.transaction(
				[
					"users",
				],
				async tx => {
					const usersCol = tx.c("users");
					await usersCol.add({
						name: "Alice",
					});
					throw new Error("Transaction failed");
				},
			);
			expect.unreachable("Should have thrown");
		} catch (err: any) {
			expect(err).toBeInstanceOf(AggregateError);
			expect(err.message).toBe("Transaction failed and rollback failed");
			expect(err.errors).toHaveLength(2);
			expect(err.errors[0].message).toBe("Transaction failed");
			expect(err.errors[1].message).toBe("Rollback failed");
		}
	});

	test("4. should release locks after transaction completes", async () => {
		const db = createTransactionalValthera();
		await db.init();

		await db.transaction(
			[
				"users",
			],
			async tx => {
				const usersCol = tx.c("users");
				await usersCol.add({
					name: "Alice",
				});
			},
		);

		const usersCol = db.c("users");
		const users = await usersCol.find();
		expect(users).toHaveLength(1);
	});

	test("5. should work with multiple collections", async () => {
		const db = createTransactionalValthera();
		await db.init();

		await db.transaction(
			[
				"users",
				"posts",
			],
			async tx => {
				const usersCol = tx.c("users");
				const postsCol = tx.c("posts");

				await usersCol.add({
					name: "Alice",
				});
				await postsCol.add({
					title: "First post",
				});
			},
		);

		const users = await db.c("users").find();
		const posts = await db.c("posts").find();

		expect(users).toHaveLength(1);
		expect(posts).toHaveLength(1);
	});

	test("6. should pass transaction handle to operations", async () => {
		let capturedHandle: any = null;
		class CapturingAction extends TransactionalMemoryAction {
			async add(query: any) {
				capturedHandle = query.transaction;
				return super.add(query);
			}
		}

		const db = new ValtheraClass({
			adapter: new CapturingAction(),
		});
		await db.init();

		await db.transaction(
			[
				"users",
			],
			async tx => {
				const usersCol = tx.c("users");
				await usersCol.add({
					name: "Alice",
				});
			},
		);

		expect(capturedHandle).toBeDefined();
		expect(capturedHandle.id).toBeDefined();
	});

	test("7. should use transaction methods for add/find/update/remove", async () => {
		const db = createTransactionalValthera();
		await db.init();

		await db.transaction(
			[
				"users",
			],
			async tx => {
				const usersCol = tx.c("users");

				const added = await usersCol.add({
					name: "Alice",
					age: 25,
				});
				expect(added).toHaveProperty("_id");

				const found = await usersCol.find({
					name: "Alice",
				});
				expect(found).toHaveLength(1);

				await usersCol.update(
					{
						name: "Alice",
					},
					{
						$set: {
							age: 30,
						},
					},
				);
				const updated = await usersCol.findOne({
					name: "Alice",
				});
				expect(updated?.age).toBe(30);

				await usersCol.remove({
					name: "Alice",
				});
				const removed = await usersCol.find({
					name: "Alice",
				});
				expect(removed).toHaveLength(0);
			},
		);
	});
});
