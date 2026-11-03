import { QueryValidationError } from "../errors.js";
import { isUnsafeKey } from "../utils/security.js";
import { genId } from "./gen.js";
function assertSafeIdKey(idKey) {
    if (!isUnsafeKey(idKey))
        return;
    throw new QueryValidationError("Unsafe idKey", {
        op: "addId",
        idKey,
    });
}
const defaultIdGen = (data, _collection, adapter) => data.map(() => genId(adapter.adapterOpts.idParts));
const numberIdGen = async (data, collection, adapter, transaction) => {
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
    }));
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
    return data.map((_, i) => (start + i + 1));
};
async function applyIdGen(records, collection, actions, idGenEnabled, transaction) {
    if (!idGenEnabled)
        return;
    const { idKey = "_id", numberId, idGen } = actions.adapterOpts;
    assertSafeIdKey(idKey);
    const targets = records.filter(data => !data[idKey]);
    if (!targets.length)
        return;
    const generator = idGen ?? (numberId ? numberIdGen : defaultIdGen);
    const ids = await generator(targets, collection, actions, transaction);
    for (let i = 0; i < targets.length; i++) {
        targets[i][idKey] = ids[i];
    }
}
export async function addId(query, actions, defaultGen = true) {
    const id_gen = query.id_gen ?? defaultGen;
    await applyIdGen([
        query.data,
    ], query.collection, actions, id_gen, query.transaction);
}
export async function addIdBulk(query, actions, defaultGen = true) {
    const id_gen = query.id_gen ?? defaultGen;
    await applyIdGen(query.datas, query.collection, actions, id_gen, query.transaction);
}
