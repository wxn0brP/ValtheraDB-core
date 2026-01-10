import { Arg, Search, Updater } from "../types/arg";
import { DbFindOpts, FindOpts } from "../types/options";
import { VContext } from "../types/types";
import Data from "../types/data";
import { UpdateOneOrAdd, ValtheraCompatible } from "../types/valthera";

export class CollectionManager<D = Data> {
    constructor(private db: ValtheraCompatible, private collection: string) { }

    /**
     * Add data to a database.
     */
    async add(data: Arg<D>, id_gen: boolean = true) {
        return await this.db.add(this.collection, data, id_gen) as D;
    }

    /**
     * Find data in a database.
     */
    async find(search: Search<D> = {}, options: DbFindOpts<D> = {}, findOpts: FindOpts<D> = {}, context: VContext = {}) {
        return await this.db.find(this.collection, search, options, findOpts, context) as D[];
    }

    /**
     * Find one data entry in a database.
     */
    async findOne(search: Search<D> = {}, findOpts: FindOpts<D> = {}, context: VContext = {}) {
        return await this.db.findOne(this.collection, search, findOpts, context) as (D | null);
    }

    /**
     * Update data in a database.
     */
    async update(search: Search<D>, updater: Updater<D>, context: VContext = {}) {
        return await this.db.update(this.collection, search, updater, context) as boolean;
    }

    /**
     * Update one data entry in a database.
     */
    async updateOne(search: Search<D>, updater: Updater<D>, context: VContext = {}) {
        return await this.db.updateOne(this.collection, search, updater, context) as boolean;
    }

    /**
     * Remove data from a database.
     */
    async remove(search: Search<D>, context: VContext = {}) {
        return await this.db.remove(this.collection, search, context) as boolean;
    }

    /**
     * Remove one data entry from a database.
     */
    async removeOne(search: Search<D>, context: VContext = {}) {
        return await this.db.removeOne(this.collection, search, context) as boolean;
    }

    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    async updateOneOrAdd(
        search: Search<D>,
        updater: Updater<D>,
        {
            add_arg = {},
            context = {},
            id_gen = true
        }: UpdateOneOrAdd<D> = {}
    ) {
        return await this.db.updateOneOrAdd(this.collection, search, updater, { add_arg, context, id_gen }) as boolean;
    }

    /**
     * Asynchronously removes one entry in a database or adds a new one if it doesn't exist. Usage e.g. for toggling a flag.
     */
    async toggleOne(search: Search<D>, data: Arg<D> = {}, context: VContext = {}) {
        return await this.db.toggleOne(this.collection, search, data, context) as boolean;
    }
}