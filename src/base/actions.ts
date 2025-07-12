import { setDataUsingUpdateOneOrAdd } from "../helpers/updateOneOrAdd";
import Data from "../types/data";
import { VQuery } from "../types/query";

class dbActionBase {
    async getCollections() {
        throw new Error("Not implemented");
        return [] as string[];
    }

    async checkCollection(config: VQuery) {
        throw new Error("Not implemented");
        return false;
    }

    async issetCollection(config: VQuery) {
        throw new Error("Not implemented");
        return false;
    }

    async add(config: VQuery) {
        throw new Error("Not implemented");
        return {} as Data;
    }

    async find(config: VQuery) {
        throw new Error("Not implemented");
        return [] as Data[];
    }

    async findOne(config: VQuery): Promise<Data | null> {
        throw new Error("Not implemented");
        return {} as Data;
    }

    async update(config: VQuery) {
        throw new Error("Not implemented");
        return false;
    }

    async updateOne(config: VQuery) {
        throw new Error("Not implemented");
        return false;
    }

    async remove(config: VQuery) {
        throw new Error("Not implemented");
        return false;
    }

    async removeOne(config: VQuery) {
        throw new Error("Not implemented");
        return false;
    }

    async removeCollection(config: VQuery) {
        throw new Error("Not implemented");
        return false;
    }

    async updateOneOrAdd(config: VQuery) {
        const res = await this.updateOne(config);
        if (!res) {
            setDataUsingUpdateOneOrAdd(config);
            await this.add(config);
        }
        return res as boolean;
    }
}

export default dbActionBase;