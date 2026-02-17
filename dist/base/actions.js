import { setDataForToggleOne, setDataForUpdateOneOrAdd } from "../helpers/assignDataPush.js";
export class ActionsBase {
    _inited = true;
    numberId = false;
    async init(...args) { }
    async updateOneOrAdd(config) {
        const res = await this.updateOne(config);
        if (res)
            return {
                data: res,
                type: "updated"
            };
        setDataForUpdateOneOrAdd(config);
        return {
            data: await this.add(config),
            type: "added"
        };
    }
    async toggleOne(config) {
        const res = await this.removeOne(config);
        if (res)
            return {
                data: res,
                type: "removed"
            };
        setDataForToggleOne(config);
        return {
            data: await this.add(config),
            type: "added"
        };
    }
}
