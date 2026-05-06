import { ActionsBase } from "../base/actions.js";
export class MultiBackend extends ActionsBase {
    backends;
    primaryBackend;
    constructor(backends, primaryIndex = 0) {
        super();
        this.backends = backends;
        this.primaryBackend = backends[primaryIndex] || backends[0];
    }
    async init(...args) {
        await Promise.all(this.backends.map(b => b.init?.(...args)));
    }
    async add(config) {
        return await this.primaryBackend.add({ ...config });
    }
    async find(config) {
        const results = await Promise.all(this.backends.map(b => b.find({ ...config })));
        return results.flat();
    }
    async findOne(config) {
        for (const backend of this.backends) {
            try {
                const result = await backend.findOne({ ...config });
                if (result !== null && result !== undefined) {
                    return result;
                }
            }
            catch {
                continue;
            }
        }
        return null;
    }
    async update(config) {
        const results = await Promise.all(this.backends.map(b => b.update({ ...config })));
        return results.flat();
    }
    async updateOne(config) {
        for (const backend of this.backends) {
            try {
                const result = await backend.updateOne({ ...config });
                if (result)
                    return result;
            }
            catch (error) {
                continue;
            }
        }
        return null;
    }
    async remove(config) {
        const results = await Promise.all(this.backends.map(b => b.remove({ ...config })));
        return results.flat();
    }
    async removeOne(config) {
        for (const backend of this.backends) {
            try {
                const result = await backend.removeOne({ ...config });
                if (result)
                    return result;
            }
            catch (error) {
                continue;
            }
        }
        return null;
    }
    async ensureCollection(collection) {
        const results = await Promise.all(this.backends.map(b => b.ensureCollection(collection)));
        return results.some(Boolean);
    }
    async issetCollection(collection) {
        for (const backend of this.backends) {
            if (await backend.issetCollection(collection)) {
                return true;
            }
        }
        return false;
    }
    async removeCollection(collection) {
        const results = await Promise.all(this.backends.map(b => b.removeCollection(collection)));
        return results.some(Boolean);
    }
    async getCollections() {
        const allCollections = await Promise.all(this.backends.map(b => b.getCollections()));
        const uniqueCollections = new Set();
        allCollections.forEach(collections => {
            collections.forEach(collection => uniqueCollections.add(collection));
        });
        return Array.from(uniqueCollections);
    }
}
