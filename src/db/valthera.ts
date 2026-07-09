import { VEE } from "@wxn0brp/event-emitter";
import { ActionsBase } from "../base/actions";
import { Collection } from "../helpers/collection";
import { ExecutorInterface, SmartExecutor } from "../helpers/executor";
import { Data } from "../types/data";
import { DbOpts } from "../types/options";
import { PluginContext, ValtheraPlugin } from "../types/plugin";
import { VQuery, VQueryT } from "../types/query";
import { ValtheraCompatible } from "../types/valthera";
import { version } from "../version";

/**
 * Represents a database management class for performing CRUD operations.
 * @class
 */
export class ValtheraClass implements ValtheraCompatible {
    adapter: ActionsBase;
    executor: ExecutorInterface;
    emitter: VEE<{
        [K in keyof ValtheraCompatible]:
        (
            query: VQuery,
            result: Awaited<ReturnType<ValtheraCompatible[K]>>
        ) => void;
    } & {
        "*": (
            name: keyof ValtheraCompatible,
            query: VQuery,
            result: any
        ) => void;
    }> = new VEE();
    /** @deprecated typo */
    emiter = this.emitter;
    version = version;

    _plugins: ValtheraPlugin[] = [];

    plugin(p: ValtheraPlugin) {
        p.init?.(this);
        this._plugins.push(p);
        return () => {
            const i = this._plugins.indexOf(p);
            if (i !== -1) this._plugins.splice(i, 1);
        };
    }

    /** @deprecated use `adapter` */
    get dbAction() {
        return this.adapter;
    }

    /** @deprecated use `adapter` */
    set dbAction(action: ActionsBase) {
        this.adapter = action;
    }

    constructor(public options: DbOpts) {
        this.executor = options.executor || new SmartExecutor(undefined, false);

        options.adapter ??= options.dbAction!;
        options.dbAction ??= options.adapter!;

        if (typeof options.adapter === "function")
            return;
        else
            this.adapter = options.adapter as ActionsBase;
    }

    async init(...args: any[]) {
        if (this.adapter?._inited) return;

        const self = this;
        return await this.executor.addOp(async () => {
            if (self.adapter?._inited) return;

            if (typeof self.options.adapter === "function")
                self.adapter = await (self.options.adapter as any)();

            // if the executor is not set, and the action wants a smart executor
            if (!self.options.executor && self.adapter.smartExecutor && self.executor instanceof SmartExecutor)
                self.executor.aware = true;

            if (self.options.numberId)
                self.adapter.numberId = true;

            await self.adapter.init(...args);
            self.adapter._inited = true;
        });
    }

    async close(...args: any[]) {
        if (!this.adapter._inited) return;
        const self = this;
        return await this.executor.addOp(async () => {
            if (!self.adapter._inited) return;
            await self.adapter.close(...args);
            self.adapter._inited = false;
        });
    }

    async execute<T>(name: keyof ValtheraCompatible, query: VQuery<any> | string) {
        await this.init();

        const plugins = this._plugins;
        const self = this;
        let idx = 0;

        const ctx: PluginContext = {
            op: name as string,
            query,
            next: async () => {
                if (idx < plugins.length)
                    return plugins[idx++].execute(ctx);

                return self.executor.addOp(
                    (self.adapter as any)[ctx.op].bind(self.adapter),
                    ctx.query,
                    typeof ctx.query === "string" ? ctx.query : ctx.query.collection
                );
            }
        };

        const result = await ctx.next();
        this.emitter.emit(ctx.op, ctx.query, result);
        return result as T;
    }

    /**
     * Create a new instance of a Collection class.
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
        return await this.execute<boolean>("ensureCollection", collection);
    }

    /**
     * Check if a collection exists.
     */
    async issetCollection(collection: string) {
        return await this.execute<boolean>("issetCollection", collection);
    }

    /**
     * Add data to a database.
     */
    add<T = Data>(query: VQueryT.Add<T>) {
        query.control ||= {};
        query.id_gen ??= true;
        return this.execute<T>("add", query);
    }

    /**
     * Find data in a database.
     */
    find<T = Data>(query: VQueryT.Find<T>) {
        query.search ||= {};
        query.dbFindOpts ||= {};
        query.findOpts ||= {};
        query.context ||= {};
        query.control ||= {};
        return this.execute<T[]>("find", query);
    }

    /**
     * Find one data entry in a database.
     */
    findOne<T = Data>(query: VQueryT.FindOne<T>) {
        query.findOpts ||= {};
        query.context ||= {};
        query.control ||= {};
        return this.execute<T | null>("findOne", query);
    }

    /**
     * Update data in a database.
     */
    update<T = Data>(query: VQueryT.Update<T>) {
        query.context ||= {};
        query.control ||= {};
        return this.execute<T[]>("update", query);
    }

    /**
     * Update one data entry in a database.
     */
    updateOne<T = Data>(query: VQueryT.Update<T>) {
        query.context ||= {};
        query.control ||= {};
        return this.execute<T | null>("updateOne", query);
    }

    /**
     * Remove data from a database.
     */
    remove<T = Data>(query: VQueryT.Remove<T>) {
        query.context ||= {};
        query.control ||= {};
        return this.execute<T[]>("remove", query);
    }

    /**
     * Remove one data entry from a database.
     */
    removeOne<T = Data>(query: VQueryT.Remove<T>) {
        query.context ||= {};
        query.control ||= {};
        return this.execute<T | null>("removeOne", query);
    }

    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    updateOneOrAdd<T = Data>(query: VQueryT.UpdateOneOrAdd<T>) {
        query.context ||= {};
        query.add_arg ||= {};
        query.control ||= {};
        query.id_gen ??= true;
        return this.execute<VQueryT.UpdateOneOrAddResult<T>>("updateOneOrAdd", query);
    }

    /**
     * Asynchronously removes one entry in a database or adds a new one if it doesn't exist. Usage e.g. for toggling a flag.
     * Returns a promise resolving to `false` if the entry was found and removed,
     * or `true` if the entry was added. The returned value reflects the state of the database
     * after the operation.
     */
    toggleOne<T = Data>(query: VQueryT.ToggleOne<T>) {
        query.data ||= {};
        query.context ||= {};
        query.control ||= {};
        return this.execute<VQueryT.ToggleOneResult<T>>("toggleOne", query);
    }

    /**
     * Removes a database collection from the file system.
     */
    removeCollection(collection: string) {
        return this.execute<boolean>("removeCollection", collection);
    }
}
