import { Data, DataInternal } from "./types/data";
import { FileCpu } from "./types/fileCpu";
import { VQueryT } from "./types/query";
import { matchObj, updateObj } from "./utils/process";
import { updateFindObject } from "./utils/updateFindObject";

export type WriteFile = (file: string, data: any[]) => Promise<void>;
export type ReadFile = (file: string) => Promise<any[]>;

export function pathRepair(path: string) {
	return path.replace(/\/+/g, "/");
}

export class CustomFileCpu implements FileCpu {
	_readFile: ReadFile;
	_writeFile: WriteFile;

	constructor(
		readFile: ReadFile,
		writeFile: WriteFile,
		public requireClone = false,
	) {
		this._readFile = readFile;
		this._writeFile = writeFile;
	}

	async add(file: string, config: VQueryT.Add): Promise<void> {
		file = pathRepair(file);
		const entries = await this._readFile(file);
		entries.push(config.data);
		await this._writeFile(file, entries);
	}

	async find(file: string, config: VQueryT.Find): Promise<Data[]> {
		file = pathRepair(file);
		const entries = await this._readFile(file);
		const result = entries.filter(entry => matchObj(config, entry));
		const objs = this.requireClone ? structuredClone(result) : result;
		return objs.map(obj => updateFindObject(obj, config.findOpts || {}));
	}

	async findOne(
		file: string,
		config: VQueryT.FindOne,
	): Promise<DataInternal | false> {
		file = pathRepair(file);
		const entries = await this._readFile(file);

		for (const entry of entries) {
			const isMatch = matchObj(config, entry);
			if (!isMatch) continue;
			const obj = this.requireClone ? structuredClone(entry) : entry;
			return updateFindObject(obj, config.findOpts || {}) as DataInternal;
		}
		return false;
	}

	async remove(
		file: string,
		config: VQueryT.Remove,
		one: boolean,
	): Promise<DataInternal[]> {
		file = pathRepair(file);
		let entries = await this._readFile(file);
		const removed = [];

		entries = entries.filter(entry => {
			if (removed.length && one) return true;

			if (matchObj(config, entry)) {
				removed.push(entry);
				return false;
			}

			return true;
		});

		if (removed.length) await this._writeFile(file, entries);

		return removed;
	}

	async update(
		file: string,
		config: VQueryT.Update,
		one: boolean,
	): Promise<DataInternal[]> {
		file = pathRepair(file);
		let entries = await this._readFile(file);
		const updated = [];

		entries = entries.map(entry => {
			if (updated.length && one) return entry;

			if (matchObj(config, entry)) {
				const updatedEntry = updateObj(config, entry);
				updated.push(updatedEntry);
				return updatedEntry;
			}

			return entry;
		});

		if (updated.length) await this._writeFile(file, entries);

		return updated;
	}
}
