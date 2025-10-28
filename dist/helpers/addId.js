import genId from "./gen.js";
export async function addId(query, actions, defaultGen = true) {
    const { collection, data } = query;
    const id_gen = query.id_gen ?? defaultGen;
    if (!id_gen)
        return data;
    if (data._id)
        return data;
    const { numberId } = actions;
    if (!numberId) {
        data._id = genId();
        return;
    }
    const find = await actions.findOne({ collection: "__vdb_id", search: { c: collection } });
    data._id = find ? find.i + 1 : 1;
    await actions.updateOneOrAdd({
        collection: "__vdb_id",
        search: { c: collection },
        updater: {
            $inc: { i: 1 }
        },
        id_gen: false,
    });
}
