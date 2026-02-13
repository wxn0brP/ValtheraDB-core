import { VEE } from "@wxn0brp/event-emitter";
import { ActionsBase } from "../base/actions";
import { Collection } from "../helpers/collection";
import { Executor } from "../helpers/executor";
import { Data } from "../types/data";
import { DbOpts } from "../types/options";
import { VQuery } from "../types/query";
import {
    AddQuery,
    FindOneQuery,
    FindQuery,
    RemoveQuery,
    ToggleOneQuery,
    UpdateOneOrAddQuery,
    UpdateQuery,
    ValtheraCompatible
} from "../types/valthera";
import { version } from "../version";

type DbActionsFns = keyof {
    [K in keyof ActionsBase as ActionsBase[K] extends (...args: any[]) => any ? K : never]: any;
}

/**
 * Represents a database management class for performing CRUD operations.
 * @class
 */
export class ValtheraClass implements ValtheraCompatible {
    dbAction: ActionsBase;
    executor: Executor;
    emiter: VEE<{
        [K in keyof ValtheraCompatible]:
        (
            query: VQuery,
            result: Awaited<ReturnType<ValtheraCompatible[K]>>
        ) => void;
    } & {
        "*": (
            name: DbActionsFns,
            query: VQuery,
            result: any
        ) => void;
    }> = new VEE();
    version = version;

    constructor(options: DbOpts = {}) {
        this.dbAction = options.dbAction || new ActionsBase();
        this.executor = options.executor || new Executor();
        if (options.numberId) this.dbAction.numberId = true;
    }

    async init(...args: any[]) {
        if (this.dbAction._inited) return;
        const self = this;
        return await this.executor.addOp(async () => {
            if (self.dbAction._inited) return;
            await self.dbAction.init(...args);
            self.dbAction._inited = true;
        });
    }

    async execute<T>(name: DbActionsFns, query: VQuery) {
        await this.init();
        const result = await this.executor.addOp(this.dbAction[name].bind(this.dbAction), query) as T;
        this.emiter.emit(name, query, result);
        return result;
    }

    /**
     * Create a new instance of a CollectionManager class.
     */
    c<T = Data>(collection: string): Collection<T> {
        return new Collection<T>(this, collection);
    }

    /**
     * Get the names of all available databases.
     */
    async getCollections() {
        return await this.execute<string[]>("getCollections", {});
    }

    /**
     * Check and create the specified collection if it doesn't exist.
     */
    async ensureCollection(collection: string) {
        return await this.execute<boolean>("ensureCollection", { collection });
    }

    /**
     * Check if a collection exists.
     */
    async issetCollection(collection: string) {
        return await this.execute<boolean>("issetCollection", { collection });
    }

    /**
     * Add data to a database.
     */
    add<T = Data>(query: AddQuery) {
        query.control ||= {};
        return this.execute<T>("add", query);
    }

    /**
     * Find data in a database.
     */
    find<T = Data>(query: FindQuery) {
        query.dbFindOpts ||= {};
        query.findOpts ||= {};
        query.context ||= {};
        query.control ||= {};
        return this.execute<T[]>("find", query);
    }

    /**
     * Find one data entry in a database.
     */
    findOne<T = Data>(query: FindOneQuery) {
        query.findOpts ||= {};
        query.context ||= {};
        query.control ||= {};
        return this.execute<T | null>("findOne", query);
    }

    /**
     * Update data in a database.
     */
    update<T = Data>(query: UpdateQuery) {
        query.context ||= {};
        query.control ||= {};
        return this.execute<T[] | null>("update", query);
    }

    /**
     * Update one data entry in a database.
     */
    updateOne<T = Data>(query: UpdateQuery) {
        query.context ||= {};
        query.control ||= {};
        return this.execute<T | null>("updateOne", query);
    }

    /**
     * Remove data from a database.
     */
    remove<T = Data>(query: RemoveQuery) {
        query.context ||= {};
        query.control ||= {};
        return this.execute<T[] | null>("remove", query);
    }

    /**
     * Remove one data entry from a database.
     */
    removeOne<T = Data>(query: RemoveQuery) {
        query.context ||= {};
        query.control ||= {};
        return this.execute<T | null>("removeOne", query);
    }

    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    updateOneOrAdd<T = Data>(query: UpdateOneOrAddQuery) {
        query.context ||= {};
        query.add_arg ||= {};
        query.control ||= {};
        query.id_gen ||= true;
        return this.execute<T>("updateOneOrAdd", query);
    }

    /**
     * Asynchronously removes one entry in a database or adds a new one if it doesn't exist. Usage e.g. for toggling a flag.
     */
    toggleOne<T = Data>(query: ToggleOneQuery) {
        query.data ||= {};
        query.context ||= {};
        query.control ||= {};
        return this.execute<T | null>("toggleOne", query);
    }

    /**
     * Removes a database collection from the file system.
     */
    removeCollection(collection: string) {
        return this.execute<boolean>("removeCollection", { collection });
    }
}
