import ActionsBase from "../base/actions.js";
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
        return results.some(Boolean);
    }
    async updateOne(config) {
        for (const backend of this.backends) {
            try {
                const result = await backend.updateOne({ ...config });
                if (result === true) {
                    return true;
                }
            }
            catch (error) {
                continue;
            }
        }
        return false;
    }
    async remove(config) {
        const results = await Promise.all(this.backends.map(b => b.remove({ ...config })));
        return results.some(Boolean);
    }
    async removeOne(config) {
        for (const backend of this.backends) {
            try {
                const result = await backend.removeOne({ ...config });
                if (result === true) {
                    return true;
                }
            }
            catch (error) {
                continue;
            }
        }
        return false;
    }
    async ensureCollection(config) {
        const results = await Promise.all(this.backends.map(b => b.ensureCollection({ ...config })));
        return results.some(Boolean);
    }
    async issetCollection(config) {
        for (const backend of this.backends) {
            if (await backend.issetCollection({ ...config })) {
                return true;
            }
        }
        return false;
    }
    async removeCollection(config) {
        const results = await Promise.all(this.backends.map(b => b.removeCollection({ ...config })));
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
