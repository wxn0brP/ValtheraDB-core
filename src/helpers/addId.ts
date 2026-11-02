import { ActionsBase } from "../base/actions";
import { QueryValidationError } from "../errors";
import { Data } from "../types/data";
import { Id } from "../types/Id";
import { IdGen } from "../types/options";
import { VQueryT } from "../types/query";
import { TransactionHandle } from "../types/transaction";
import { isUnsafeKey } from "../utils/security";
import { genId } from "./gen";

function assertSafeIdKey(idKey: string) {
	if (!isUnsafeKey(idKey)) return;
	throw new QueryValidationError("Unsafe idKey", {
		op: "addId",
		idKey,
	});
}

const defaultIdGen: IdGen = (data, _collection, adapter) =>
	data.map(() => genId(adapter.adapterOpts.idParts));

const numberIdGen: IdGen = async (data, collection, adapter, transaction) => {
	const txOpts = transaction
		? {
				transaction,
			}
		: {};

	const found = (await adapter.findOne({
		collection: "__vdb_id",
		search: {
			c: collection,
		},
		...txOpts,
	})) as {
		i: number;
	} | null;

	const start = found?.i ?? 0;

	await adapter.updateOneOrAdd({
		collection: "__vdb_id",
		search: {
			c: collection,
		},
		updater: {
			$inc: {
				i: data.length,
			},
		},
		id_gen: false,
		...txOpts,
	});

	return data.map((_, i) => (start + i + 1) as unknown as Id);
};

async function applyIdGen(
	records: Data[],
	collection: string,
	actions: ActionsBase,
	idGenEnabled: boolean,
	transaction?: TransactionHandle,
) {
	if (!idGenEnabled) return;

	const { idKey = "_id", numberId, idGen } = actions.adapterOpts;
	assertSafeIdKey(idKey);

	const targets = records.filter(data => !data[idKey]);
	if (!targets.length) return;

	const generator = idGen ?? (numberId ? numberIdGen : defaultIdGen);
	const ids = await generator(targets, collection, actions, transaction);

	for (let i = 0; i < targets.length; i++) {
		targets[i][idKey] = ids[i];
	}
}

export async function addId(
	query: VQueryT.Add,
	actions: ActionsBase,
	defaultGen = true,
) {
	const id_gen = query.id_gen ?? defaultGen;

	await applyIdGen(
		[
			query.data,
		],
		query.collection,
		actions,
		id_gen,
		query.transaction,
	);
}

export async function addIdBulk(
	query: VQueryT.BulkAdd,
	actions: ActionsBase,
	defaultGen = true,
) {
	const id_gen = query.id_gen ?? defaultGen;

	await applyIdGen(
		query.datas,
		query.collection,
		actions,
		id_gen,
		query.transaction,
	);
}
