import { genId } from "./gen.js";
export async function addId(query, actions, defaultGen = true) {
    const collection = query.collection;
    const data = query.data;
    const id_gen = query.id_gen ?? defaultGen;
    const { idKey = "_id", numberId } = actions.adapterOpts;
    if (!id_gen)
        return data;
    if (data[idKey])
        return data;
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
    }));
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
export async function addIdBulk(query, actions, defaultGen = true) {
    const collection = query.collection;
    const id_gen = query.id_gen ?? defaultGen;
    const { idKey = "_id", numberId } = actions.adapterOpts;
    if (!id_gen)
        return;
    if (!numberId) {
        for (const data of query.datas) {
            if (!data[idKey])
                data[idKey] = genId();
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
    }));
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
