import { Arg, Search, Updater } from "../types/arg";
import { Data } from "../types/data";
import { DbFindOpts, FindOpts } from "../types/options";
import { VContext } from "../types/types";
import { UpdateOneOrAdd, ValtheraCompatible } from "../types/valthera";

export class Collection<D = Data> {
    constructor(
        public db: ValtheraCompatible,
        public collection: string
    ) { }

    /**
     * Add data to a database.
     */
    add(data: Arg<D>, id_gen: true): Promise<D>;
    add(data: Arg<D>, id_gen?: true): Promise<D & { _id: string }>;
    add(data: Arg<D>, id_gen?: boolean): Promise<D> {
        return this.db.add({ collection: this.collection, data, id_gen });
    }

    /**
     * Find data in a database.
     */
    find(search: Search<D> = {}, options: DbFindOpts<D> = {}, findOpts: FindOpts<D> = {}, context: VContext = {}): Promise<D[]> {
        return this.db.find({ collection: this.collection, search, dbFindOpts: options, findOpts, context });
    }

    /**
     * Find one data entry in a database.
     */
    findOne(search: Search<D> = {}, findOpts: FindOpts<D> = {}, context: VContext = {}): Promise<D> {
        return this.db.findOne({ collection: this.collection, search, findOpts, context });
    }

    /**
     * Update data in a database.
     */
    update(search: Search<D>, updater: Updater<D>, context: VContext = {}): Promise<D[]> {
        return this.db.update({ collection: this.collection, search, updater, context });
    }

    /**
     * Update one data entry in a database.
     */
    updateOne(search: Search<D>, updater: Updater<D>, context: VContext = {}): Promise<D> {
        return this.db.updateOne({ collection: this.collection, search, updater, context });
    }

    /**
     * Remove data from a database.
     */
    remove(search: Search<D>, context: VContext = {}): Promise<D[]> {
        return this.db.remove({ collection: this.collection, search, context });
    }

    /**
     * Remove one data entry from a database.
     */
    removeOne(search: Search<D>, context: VContext = {}): Promise<D> {
        return this.db.removeOne({ collection: this.collection, search, context });
    }

    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    updateOneOrAdd(
        search: Search<D>,
        updater: Updater<D>,
        {
            add_arg = {},
            context = {},
            id_gen = true
        }: UpdateOneOrAdd<D> = {}
    ): Promise<D> {
        return this.db.updateOneOrAdd({ collection: this.collection, search, updater, add_arg, context, id_gen });
    }

    /**
     * Asynchronously removes one entry in a database or adds a new one if it doesn't exist. Usage e.g. for toggling a flag.
     */
    toggleOne(search: Search<D>, data: Arg<D> = {}, context: VContext = {}): Promise<D> {
        return this.db.toggleOne({ collection: this.collection, search, data, context });
    }
}