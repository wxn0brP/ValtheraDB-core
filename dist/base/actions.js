import { setDataForToggleOne, setDataForUpdateOneOrAdd, } from "../helpers/assignDataPush.js";
export class ActionsBase {
    _inited = true;
    adapterOpts = {
        numberId: false,
        idKey: "_id",
    };
    smartExecutor = false;
    get numberId() {
        return this.adapterOpts.numberId ?? false;
    }
    set numberId(value) {
        this.adapterOpts.numberId = value;
    }
    get idKey() {
        return this.adapterOpts.idKey ?? "_id";
    }
    set idKey(value) {
        this.adapterOpts.idKey = value;
    }
    async init(...args) { }
    async close(...args) { }
    async updateOneOrAdd(config) {
        const res = await this.updateOne(config);
        if (res)
            return {
                data: res,
                type: "updated",
            };
        // transform UpdateOneQuery to AddQuery
        setDataForUpdateOneOrAdd(config);
        return {
            data: await this.add(config),
            type: "added",
        };
    }
    async toggleOne(config) {
        const res = await this.removeOne(config);
        if (res)
            return {
                data: res,
                type: "removed",
            };
        // transform ToggleOneQuery to AddQuery
        setDataForToggleOne(config);
        return {
            data: await this.add(config),
            type: "added",
        };
    }
}
