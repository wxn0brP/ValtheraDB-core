import { setDataForToggleOne, setDataForUpdateOneOrAdd, } from "../helpers/assignDataPush.js";
import { version } from "../version.js";
export class ActionsBase {
    _inited = true;
    adapterOpts = {
        numberId: false,
        idKey: "_id",
    };
    smartExecutor = false;
    version = "ActionsBase-core-" + version;
    async init(...args) { }
    async close(...args) { }
    async beginTransaction(id) {
        throw new Error("Transactions are not supported for ActionsBase");
    }
    async commitTransaction(handle) {
        throw new Error("Transactions are not supported for ActionsBase");
    }
    async rollbackTransaction(handle) {
        throw new Error("Transactions are not supported for ActionsBase");
    }
    async createIndex(config) {
        // No-op: adapter does not use indexes internally
    }
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
