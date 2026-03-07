import { ActionsBase } from "../base/actions";
import * as Query from "../types/query";

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

    async add(config: Query.AddQuery) {
        return await this.primaryBackend.add({ ...config });
    }

    async find(config: Query.FindQuery) {
        const results = await Promise.all(
            this.backends.map(b => b.find({ ...config }))
        );

        return results.flat();
    }

    async findOne(config: Query.FindOneQuery) {
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

    async update(config: Query.UpdateQuery) {
        const results = await Promise.all(
            this.backends.map(b => b.update({ ...config }))
        );

        return results.flat();
    }

    async updateOne(config: Query.UpdateQuery) {
        for (const backend of this.backends) {
            try {
                const result = await backend.updateOne({ ...config });
                if (result) return result;
            } catch (error) {
                continue;
            }
        }
        return null;
    }

    async remove(config: Query.RemoveQuery) {
        const results = await Promise.all(
            this.backends.map(b => b.remove({ ...config }))
        );

        return results.flat();
    }

    async removeOne(config: Query.RemoveQuery) {
        for (const backend of this.backends) {
            try {
                const result = await backend.removeOne({ ...config });
                if (result) return result;
            } catch (error) {
                continue;
            }
        }
        return null;
    }

    async ensureCollection(collection: string) {
        const results = await Promise.all(
            this.backends.map(b => b.ensureCollection(collection))
        );
        return results.some(Boolean);
    }

    async issetCollection(collection: string) {
        for (const backend of this.backends) {
            if (await backend.issetCollection(collection)) {
                return true;
            }
        }
        return false;
    }

    async removeCollection(collection: string) {
        const results = await Promise.all(
            this.backends.map(b => b.removeCollection(collection))
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
