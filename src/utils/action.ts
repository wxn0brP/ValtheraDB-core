import { Data } from "../types/data";
import { FileCpu } from "../types/fileCpu";
import { VQueryT } from "../types/query";
import { compareSafe } from "./compare";

export async function findUtil(
	query: VQueryT.Find,
	fileCpuOrData: FileCpu | Object[],
	files: string[],
	fileCpuOpts?: any,
): Promise<Data[]> {
	const { dbFindOpts = {} } = query;
	const {
		reverse = false,
		offset = 0,
		sortBy,
		sortAsc = true,
		min,
		max,
		avg,
		sum,
		distinct,
		groupBy,
		count,
	} = dbFindOpts;

	let limit = dbFindOpts.limit ?? -1;
	if (limit === Infinity) limit = -1;

	const needsAllData =
		min || max || avg || sum || distinct || groupBy || count || sortBy;

	let datas: Data[] = [];
	let skippedEntries = 0;

	if (Array.isArray(fileCpuOrData)) {
		datas = [
			...fileCpuOrData,
		];
		if (reverse && !sortBy) datas.reverse();
		if (!needsAllData) {
			if (offset > 0 || limit !== -1) {
				const start = offset;
				const end = limit !== -1 ? offset + limit : undefined;
				datas = datas.slice(start, end);
			}
		}
	} else {
		const filesToProcess =
			reverse && !sortBy
				? [
						...files,
					].reverse()
				: files;

		for (const f of filesToProcess) {
			let entries = (await fileCpuOrData.find(f, query, fileCpuOpts)) as Data[];
			if (reverse && !sortBy) entries.reverse();

			if (needsAllData) {
				datas.push(...entries);
				continue;
			}

			if (offset > skippedEntries) {
				const toSkip = offset - skippedEntries;
				if (entries.length <= toSkip) {
					skippedEntries += entries.length;
					continue;
				}
				entries = entries.slice(toSkip);
				skippedEntries = offset;
			}

			if (limit !== -1) {
				const remaining = limit - datas.length;
				if (entries.length > remaining) entries = entries.slice(0, remaining);
			}

			datas.push(...entries);

			if (limit !== -1 && datas.length >= limit) return datas;
		}
	}

	if (!needsAllData) return datas;

	if (datas.length === 0) return [];

	const hasAggregations = min || max || avg || sum || groupBy || count;
	if (hasAggregations) {
		const groups: Map<string, Data[]> = new Map();
		const groupKeys = Array.isArray(groupBy)
			? groupBy
			: groupBy
				? [
						groupBy,
					]
				: [];

		if (groupKeys.length) {
			for (const data of datas) {
				const key = groupKeys
					.map(k => String((data as any)[k] ?? ""))
					.join("|");
				if (!groups.has(key)) groups.set(key, []);
				groups.get(key)!.push(data);
			}
		} else {
			groups.set("all", [
				...datas,
			]);
		}

		const aggregated: Data[] = [];
		for (const [, groupItems] of groups) {
			const result: Data = {};

			if (groupKeys.length) {
				const sample = groupItems[0];
				for (const k of groupKeys) result[k] = sample[k];
			}

			if (count) {
				for (const [outKey, srcKey] of Object.entries(count)) {
					result[outKey] = groupItems.filter(
						d =>
							(d as any)[srcKey] !== undefined && (d as any)[srcKey] !== null,
					).length;
				}
			}

			for (const [outKey, srcField] of Object.entries(min ?? {})) {
				const nums = groupItems
					.map(d => (d as any)[srcField])
					.filter((v): v is number => typeof v === "number");
				result[outKey] = nums.length ? Math.min(...nums) : null;
			}

			for (const [outKey, srcField] of Object.entries(max ?? {})) {
				const nums = groupItems
					.map(d => (d as any)[srcField])
					.filter((v): v is number => typeof v === "number");
				result[outKey] = nums.length ? Math.max(...nums) : null;
			}

			for (const [outKey, srcField] of Object.entries(avg ?? {})) {
				const nums = groupItems
					.map(d => (d as any)[srcField])
					.filter((v): v is number => typeof v === "number");
				result[outKey] = nums.length
					? nums.reduce((a, b) => a + b, 0) / nums.length
					: null;
			}

			for (const [outKey, srcField] of Object.entries(sum ?? {})) {
				const nums = groupItems
					.map(d => (d as any)[srcField])
					.filter((v): v is number => typeof v === "number");
				result[outKey] = nums.length ? nums.reduce((a, b) => a + b, 0) : null;
			}

			aggregated.push(result);
		}

		datas = aggregated;
	}

	if (distinct) {
		const seen = new Set<string>();
		datas = datas.filter(item => {
			const val = (item as any)[distinct];
			const key = JSON.stringify(val);
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});
	}

	if (sortBy) {
		if (sortBy === "random()") {
			datas.sort(() => Math.random() - 0.5);
		} else if (Array.isArray(sortBy)) {
			datas.sort((a, b) => {
				for (const { field, asc = true } of sortBy) {
					const dir = asc ? 1 : -1;
					const cmp = compareSafe((a as any)[field], (b as any)[field]) * dir;
					if (cmp !== 0) return cmp;
				}
				return 0;
			});
		} else {
			const dir = sortAsc ? 1 : -1;
			datas.sort(
				(a, b) => compareSafe((a as any)[sortBy], (b as any)[sortBy]) * dir,
			);
		}
	}

	if (offset > 0 || limit !== -1) {
		const start = offset;
		const end = limit !== -1 ? offset + limit : undefined;
		datas = datas.slice(start, end);
	}

	return datas;
}
