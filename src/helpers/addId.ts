import { ActionsBase } from "../base/actions";
import { QueryValidationError } from "../errors";
import { VQuery, VQueryT } from "../types/query";
import { isUnsafeKey } from "../utils/security";
import { genId } from "./gen";

function assertSafeIdKey(idKey: string) {
	if (!isUnsafeKey(idKey)) return;
	throw new QueryValidationError("Unsafe idKey", {
		op: "addId",
		idKey,
	});
}

export async function addId(
	query: VQuery,
	actions: ActionsBase,
	defaultGen = true,
) {
	const collection = query.collection!;
	const data = query.data!;
	const id_gen = query.id_gen ?? defaultGen;

	const { idKey = "_id", numberId } = actions.adapterOpts;

	if (!id_gen) return data;
	assertSafeIdKey(idKey);
	if (data[idKey]) return data;

	if (!numberId) {
		data[idKey] = genId();
		return;
	}

	const txOpts = query.transaction
		? {
				transaction: query.transaction,
			}
		: {};

	const find = (await actions.findOne({
		collection: "__vdb_id",
		search: {
			c: collection,
		},
		...txOpts,
	})) as {
		i: number;
	};
	data[idKey] = find?.i ? find.i + 1 : 1;
	await actions.updateOneOrAdd({
		collection: "__vdb_id",
		search: {
			c: collection,
		},
		updater: {
			$inc: {
				i: 1,
			},
		},
		id_gen: false,
		...txOpts,
	});
}

export async function addIdBulk(
	query: VQueryT.BulkAdd,
	actions: ActionsBase,
	defaultGen = true,
) {
	const collection = query.collection;
	const id_gen = query.id_gen ?? defaultGen;
	const { idKey = "_id", numberId } = actions.adapterOpts;

	if (!id_gen) return;
	assertSafeIdKey(idKey);

	if (!numberId) {
		for (const data of query.datas) {
			if (!data[idKey]) data[idKey] = genId();
		}
		return;
	}

	const txOpts = query.transaction
		? {
				transaction: query.transaction,
			}
		: {};

	const find = (await actions.findOne({
		collection: "__vdb_id",
		search: {
			c: collection,
		},
		...txOpts,
	})) as {
		i: number;
	};

	const start = find?.i ?? 0;

	for (let i = 0; i < query.datas.length; i++) {
		const data = query.datas[i];
		if (!data[idKey]) {
			data[idKey] = start + i + 1;
		}
	}

	await actions.updateOneOrAdd({
		collection: "__vdb_id",
		search: {
			c: collection,
		},
		updater: {
			$inc: {
				i: query.datas.length,
			},
		},
		id_gen: false,
		...txOpts,
	});
}
