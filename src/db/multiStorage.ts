import ActionsBase from "../base/actions";
import { VQuery } from "../types/query";

export class MultiBackend extends ActionsBase {
    backends: ActionsBase[];
    primaryBackend: ActionsBase;

    constructor(backends: ActionsBase[], primaryIndex: number = 0) {
        super();
        this.backends = backends;
        this.primaryBackend = backends[primaryIndex] || backends[0];
    }

    async init(...args: any[]) {
        await Promise.all(this.backends.map(b => b.init?.(...args)));
    }

    async add(config: VQuery) {
        return await this.primaryBackend.add({ ...config });
    }

    async find(config: VQuery) {
        const results = await Promise.all(
            this.backends.map(b => b.find({ ...config }))
        );

        return results.flat();
    }

    async findOne(config: VQuery) {
        for (const backend of this.backends) {
            try {
                const result = await backend.findOne({ ...config });
                if (result !== null && result !== undefined) {
                    return result;
                }
            } catch {
                continue;
            }
        }
        return null;
    }

    async update(config: VQuery) {
        const results = await Promise.all(
            this.backends.map(b => b.update({ ...config }))
        );

        return results.some(Boolean);
    }

    async updateOne(config: VQuery) {
        for (const backend of this.backends) {
            try {
                const result = await backend.updateOne({ ...config });
                if (result === true) {
                    return true;
                }
            } catch (error) {
                continue;
            }
        }
        return false;
    }

    async remove(config: VQuery) {
        const results = await Promise.all(
            this.backends.map(b => b.remove({ ...config }))
        );

        return results.some(Boolean);
    }

    async removeOne(config: VQuery) {
        for (const backend of this.backends) {
            try {
                const result = await backend.removeOne({ ...config });
                if (result === true) {
                    return true;
                }
            } catch (error) {
                continue;
            }
        }
        return false;
    }

    async ensureCollection(config: VQuery) {
        const results = await Promise.all(
            this.backends.map(b => b.ensureCollection({ ...config }))
        );
        return results.some(Boolean);
    }

    async issetCollection(config: VQuery) {
        for (const backend of this.backends) {
            if (await backend.issetCollection({ ...config })) {
                return true;
            }
        }
        return false;
    }

    async removeCollection(config: VQuery) {
        const results = await Promise.all(
            this.backends.map(b => b.removeCollection({ ...config }))
        );
        return results.some(Boolean);
    }

    async getCollections() {
        const allCollections = await Promise.all(
            this.backends.map(b => b.getCollections())
        );

        const uniqueCollections = new Set<string>();
        allCollections.forEach(collections => {
            collections.forEach(collection => uniqueCollections.add(collection));
        });

        return Array.from(uniqueCollections);
    }
}