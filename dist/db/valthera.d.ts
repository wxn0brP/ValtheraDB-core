import { VEE } from "@wxn0brp/event-emitter";
import { ActionsBase } from "../base/actions";
import { Collection } from "../helpers/collection";
import { Executor } from "../helpers/executor";
import { Data } from "../types/data";
import { DbOpts } from "../types/options";
import { VQuery } from "../types/query";
import { AddQuery, FindOneQuery, FindQuery, RemoveQuery, ToggleOneQuery, UpdateOneOrAddQuery, UpdateQuery, ValtheraCompatible } from "../types/valthera";
export declare class ValtheraClass implements ValtheraCompatible {
    dbAction: ActionsBase;
    executor: Executor;
    emiter: VEE<{
        [K in keyof ValtheraCompatible]: (query: VQuery, result: Awaited<ReturnType<ValtheraCompatible[K]>>) => void;
    } & {
        "*": (name: keyof ValtheraCompatible, query: VQuery, result: any) => void;
    }>;
    version: string;
    constructor(options: DbOpts);
    init(...args: any[]): Promise<unknown>;
    execute<T>(name: keyof ValtheraCompatible, query: VQuery): Promise<T>;
    c<T = Data>(collection: string): Collection<T>;
    getCollections(): Promise<string[]>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    add<T = Data>(query: AddQuery): Promise<T>;
    find<T = Data>(query: FindQuery): Promise<T[]>;
    findOne<T = Data>(query: FindOneQuery): Promise<T>;
    update<T = Data>(query: UpdateQuery): Promise<T[]>;
    updateOne<T = Data>(query: UpdateQuery): Promise<T>;
    remove<T = Data>(query: RemoveQuery): Promise<T[]>;
    removeOne<T = Data>(query: RemoveQuery): Promise<T>;
    updateOneOrAdd<T = Data>(query: UpdateOneOrAddQuery): Promise<T>;
    toggleOne<T = Data>(query: ToggleOneQuery): Promise<T>;
    removeCollection(collection: string): Promise<boolean>;
}
