import { ActionsBase } from "../base/actions";
import { UnsupportedOperationError } from "../errors";
import { VQueryT } from "../types/query";
import { TransactionHandle } from "../types/transaction";

export class MultiBackend extends ActionsBase {
	backends: ActionsBase[];
	primaryBackend: ActionsBase;

	constructor(backends: ActionsBase[], primaryIndex: number = 0) {
		super();
		this.backends = backends;
		this.primaryBackend = backends[primaryIndex] || backends[0];
	}

	async init(...args: any[]) {
		for (const b of this.backends) {
			b.adapterOpts = {
				...b.adapterOpts,
				...this.adapterOpts,
			};
		}
		await Promise.all(this.backends.map(b => b.init(...args)));
	}

	async close(...args: any[]) {
		await Promise.all(this.backends.map(b => b.close(...args)));
	}

	async add(config: VQueryT.Add) {
		return await this.primaryBackend.add({
			...config,
		});
	}

	async find(config: VQueryT.Find) {
		const results = await Promise.all(
			this.backends.map(b =>
				b.find({
					...config,
				}),
			),
		);

		return results.flat();
	}

	async findOne(config: VQueryT.FindOne) {
		for (const backend of this.backends) {
			const result = await backend.findOne({
				...config,
			});
			if (result !== null && result !== undefined) {
				return result;
			}
		}
		return null;
	}

	async update(config: VQueryT.Update) {
		const results = await Promise.all(
			this.backends.map(b =>
				b.update({
					...config,
				}),
			),
		);

		return results.flat();
	}

	async updateOne(config: VQueryT.Update) {
		for (const backend of this.backends) {
			const result = await backend.updateOne({
				...config,
			});
			if (result) return result;
		}
		return null;
	}

	async remove(config: VQueryT.Remove) {
		const results = await Promise.all(
			this.backends.map(b =>
				b.remove({
					...config,
				}),
			),
		);

		return results.flat();
	}

	async removeOne(config: VQueryT.Remove) {
		for (const backend of this.backends) {
			const result = await backend.removeOne({
				...config,
			});
			if (result) return result;
		}
		return null;
	}

	async ensureCollection(collection: string) {
		const results = await Promise.all(
			this.backends.map(b => b.ensureCollection(collection)),
		);
		return results.some(Boolean);
	}

	async issetCollection(collection: string) {
		for (const backend of this.backends) {
			if (await backend.issetCollection(collection)) {
				return true;
			}
		}
		return false;
	}

	async removeCollection(collection: string) {
		const results = await Promise.all(
			this.backends.map(b => b.removeCollection(collection)),
		);
		return results.some(Boolean);
	}

	async getCollections() {
		const allCollections = await Promise.all(
			this.backends.map(b => b.getCollections()),
		);

		const uniqueCollections = new Set<string>();
		allCollections.forEach(collections => {
			collections.forEach(collection => uniqueCollections.add(collection));
		});

		return Array.from(uniqueCollections);
	}

	async beginTransaction(): Promise<TransactionHandle> {
		throw new UnsupportedOperationError("beginTransaction", {
			adapter: "MultiBackend",
		});
	}

	async commitTransaction() {
		throw new UnsupportedOperationError("commitTransaction", {
			adapter: "MultiBackend",
		});
	}

	async rollbackTransaction() {
		throw new UnsupportedOperationError("rollbackTransaction", {
			adapter: "MultiBackend",
		});
	}
}
