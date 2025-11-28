import { setDataUsingUpdateOneOrAdd } from "../helpers/updateOneOrAdd.js";
class ActionsBase {
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
        return false;
    }
    async updateOne(config) {
        throw new Error("Not implemented");
        return false;
    }
    async remove(config) {
        throw new Error("Not implemented");
        return false;
    }
    async removeOne(config) {
        throw new Error("Not implemented");
        return false;
    }
    async removeCollection(config) {
        throw new Error("Not implemented");
        return false;
    }
    async updateOneOrAdd(config) {
        const res = await this.updateOne(config);
        if (!res) {
            setDataUsingUpdateOneOrAdd(config);
            await this.add(config);
        }
        return res;
    }
    async toggleOne(config) {
        const res = await this.removeOne(config);
        if (!res)
            await this.add(config);
        return res;
    }
}
export default ActionsBase;
