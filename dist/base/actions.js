import { setDataForToggleOne, setDataForUpdateOneOrAdd } from "../helpers/assignDataPush.js";
export class ActionsBase {
    _inited = true;
    numberId = false;
    async init(...args) { }
    async updateOneOrAdd(config) {
        const res = await this.updateOne(config);
        const controlData = { updated: true };
        config.control ||= {};
        config.control.updateOneOrAdd = controlData;
        if (res)
            return res;
        setDataForUpdateOneOrAdd(config);
        config.control.updateOneOrAdd.updated = false;
        return await this.add(config);
    }
    async toggleOne(config) {
        const res = await this.removeOne(config);
        const controlData = { created: false };
        config.control ||= {};
        config.control.toggleOne = controlData;
        if (res)
            return res;
        setDataForToggleOne(config);
        config.control.toggleOne.created = true;
        return await this.add(config);
    }
}
