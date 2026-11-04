import { CustomAdapterBase } from "../base/customAdapter";
import { CustomFileCpu } from "../base/customFileCpu";
import { VQueryT } from "../types/query";
import { hasFieldsAdvanced } from "../utils/hasFieldsAdvanced";

export class MemoryAdapter extends CustomAdapterBase {
	memory: Map<string, any[]>;
	smartExecutor = true;
	capabilities = {
		transactions: false,
		indexes: false,
		persistent: false,
	};

	constructor() {
		super();
		this.fileCpu = new CustomFileCpu(
			this._readMemory.bind(this),
			this._writeMemory.bind(this),
			true,
		);
		this.memory = new Map();
	}

	_readMemory(key: string) {
		if (!this.memory.has(key)) return [];
		return this.memory.get(key)!;
	}

	_writeMemory(key: string, data: any[]) {
		this.memory.set(key, data);
	}

	async getCollections() {
		return Array.from(this.memory.keys());
	}

	async ensureCollection(collection: string) {
		if (this.memory.has(collection)) return false;
		this.memory.set(collection, []);
		return true;
	}

	async issetCollection(collection: string) {
		return this.memory.has(collection);
	}

	async removeCollection(collection: string) {
		if (!this.memory.has(collection)) return false;
		this.memory.delete(collection);
		return true;
	}

	async count(config: VQueryT.Count) {
		const collection = this._readMemory(config.collection);
		let count = 0;
		for (const item of collection)
			if (hasFieldsAdvanced(item, config.search)) count++;

		return count;
	}
}

export {
	/** @deprecated Use MemoryAdapter. */
	MemoryAdapter as MemoryAction,
};
