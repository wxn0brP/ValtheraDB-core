import { setDataForToggleOne, setDataForUpdateOneOrAdd } from "../helpers/assignDataPush.js";
export class ActionsBase {
    _inited = true;
    numberId = false;
    async init(...args) { }
    async getCollections() {
        throw new Error("Not implemented");
        return [];
    }
    async ensureCollection(config) {
        throw new Error("Not implemented");
        return false;
    }
    async issetCollection(config) {
        throw new Error("Not implemented");
        return false;
    }
    async add(config) {
        throw new Error("Not implemented");
        return {};
    }
    async find(config) {
        throw new Error("Not implemented");
        return [];
    }
    async findOne(config) {
        throw new Error("Not implemented");
        return {};
    }
    async update(config) {
        throw new Error("Not implemented");
        return [];
    }
    async updateOne(config) {
        throw new Error("Not implemented");
        return {};
    }
    async remove(config) {
        throw new Error("Not implemented");
        return [];
    }
    async removeOne(config) {
        throw new Error("Not implemented");
        return {};
    }
    async removeCollection(config) {
        throw new Error("Not implemented");
        return false;
    }
    async updateOneOrAdd(config) {
        const res = await this.updateOne(config);
        if (res)
            return true;
        setDataForUpdateOneOrAdd(config);
        await this.add(config);
        return false;
    }
    async toggleOne(config) {
        const res = await this.removeOne(config);
        if (res)
            return true;
        setDataForToggleOne(config);
        await this.add(config);
        return false;
    }
}
