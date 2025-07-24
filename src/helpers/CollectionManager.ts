import { Arg, Search, Updater } from "../types/arg";
import { DbFindOpts, FindOpts } from "../types/options";
import { VContext } from "../types/types";
import Data from "../types/data";
import { ValtheraCompatible } from "../types/valthera";

class CollectionManager<D = Data> {
    constructor(private db: ValtheraCompatible, private collection: string) {}

    /**
     * Add data to a database.
     */
    async add<T = D>(data: Arg<T>, id_gen: boolean = true) {
        return await this.db.add(this.collection, data, id_gen) as T;
    }

    /**
     * Find data in a database.
     */
    async find<T = D>(search: Search<T> = {}, context: VContext = {}, options: DbFindOpts<T> = {}, findOpts: FindOpts<T> = {}) {
        return await this.db.find(this.collection, search, context, options, findOpts) as T[];
    }

    /**
     * Find one data entry in a database.
     */
    async findOne<T = D>(search: Search<T> = {}, context: VContext = {}, findOpts: FindOpts<T> = {}) {
        return await this.db.findOne(this.collection, search, context, findOpts) as (T | null);
    }

    /**
     * Update data in a database.
     */
    async update<T = D>(search: Search<T>, updater: Updater<T>, context: VContext = {}) {
        return await this.db.update(this.collection, search, updater, context) as boolean;
    }

    /**
     * Update one data entry in a database.
     */
    async updateOne<T = D>(search: Search<T>, updater: Updater<T>, context: VContext = {}) {
        return await this.db.updateOne(this.collection, search, updater, context) as boolean;
    }

    /**
     * Remove data from a database.
     */
    async remove<T = D>(search: Search<T>, context: VContext = {}) {
        return await this.db.remove(this.collection, search, context) as boolean;
    }

    /**
     * Remove one data entry from a database.
     */
    async removeOne<T = D>(search: Search<T>, context: VContext = {}) {
        return await this.db.removeOne(this.collection, search, context) as boolean;
    }

    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    async updateOneOrAdd<T = D>(search: Search<T>, updater: Updater<T>, add_arg: Arg<T> = {}, context: VContext = {}, id_gen: boolean = true) {
        return await this.db.updateOneOrAdd(this.collection, search, updater, add_arg, context, id_gen) as boolean;
    }
}

export default CollectionManager;
