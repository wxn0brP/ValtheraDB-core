import { Arg, Search, Updater } from "../types/arg";
import { DbFindOpts, FindOpts } from "../types/options";
import { VContext } from "../types/types";
import Data from "../types/data";
import { UpdateOneOrAdd, ValtheraCompatible } from "../types/valthera";

class CollectionManager<D = Data> {
    constructor(private db: ValtheraCompatible, private collection: string) { }

    /**
     * Add data to a database.
     */
    async add<T = Data>(data: Arg<T & D>, id_gen: boolean = true) {
        return await this.db.add(this.collection, data, id_gen) as T;
    }

    /**
     * Find data in a database.
     */
    async find<T = Data>(search: Search<T & D> = {}, options: DbFindOpts<T & Data> = {}, findOpts: FindOpts<T & Data> = {}, context: VContext = {}) {
        return await this.db.find(this.collection, search, options, findOpts, context) as T[];
    }

    /**
     * Find one data entry in a database.
     */
    async findOne<T = Data>(search: Search<T & Data> = {}, findOpts: FindOpts<T & Data> = {}, context: VContext = {}) {
        return await this.db.findOne(this.collection, search, findOpts, context) as (T | null);
    }

    /**
     * Update data in a database.
     */
    async update<T = Data>(search: Search<T & Data>, updater: Updater<T & Data>, context: VContext = {}) {
        return await this.db.update(this.collection, search, updater, context) as boolean;
    }

    /**
     * Update one data entry in a database.
     */
    async updateOne<T = Data>(search: Search<T & Data>, updater: Updater<T & Data>, context: VContext = {}) {
        return await this.db.updateOne(this.collection, search, updater, context) as boolean;
    }

    /**
     * Remove data from a database.
     */
    async remove<T = Data>(search: Search<T & Data>, context: VContext = {}) {
        return await this.db.remove(this.collection, search, context) as boolean;
    }

    /**
     * Remove one data entry from a database.
     */
    async removeOne<T = Data>(search: Search<T & Data>, context: VContext = {}) {
        return await this.db.removeOne(this.collection, search, context) as boolean;
    }

    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    async updateOneOrAdd<T = Data>(search: Search<T & Data>, updater: Updater<T & Data>, { add_arg = {}, context = {}, id_gen = true }: UpdateOneOrAdd<T & Data>) {
        return await this.db.updateOneOrAdd(this.collection, search, updater, { add_arg, context, id_gen }) as boolean;
    }
}

export default CollectionManager;
