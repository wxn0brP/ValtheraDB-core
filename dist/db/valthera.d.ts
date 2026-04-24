import { VEE } from "@wxn0brp/event-emitter";
import { ActionsBase } from "../base/actions";
import { Collection } from "../helpers/collection";
import { Executor } from "../helpers/executor";
import { Data } from "../types/data";
import { DbOpts } from "../types/options";
import { VQueryT, VQuery } from "../types/query";
import { ValtheraCompatible } from "../types/valthera";
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
    execute<T>(name: keyof ValtheraCompatible, query: VQuery<any> | string): Promise<T>;
    c<T = Data>(collection: string): Collection<T>;
    getCollections(): Promise<string[]>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    add<T = Data>(query: VQueryT.Add<T>): Promise<T>;
    find<T = Data>(query: VQueryT.Find<T>): Promise<T[]>;
    findOne<T = Data>(query: VQueryT.FindOne<T>): Promise<T>;
    update<T = Data>(query: VQueryT.Update<T>): Promise<T[]>;
    updateOne<T = Data>(query: VQueryT.Update<T>): Promise<T>;
    remove<T = Data>(query: VQueryT.Remove<T>): Promise<T[]>;
    removeOne<T = Data>(query: VQueryT.Remove<T>): Promise<T>;
    updateOneOrAdd<T = Data>(query: VQueryT.UpdateOneOrAdd<T>): Promise<VQueryT.UpdateOneOrAddResult<T>>;
    toggleOne<T = Data>(query: VQueryT.ToggleOne<T>): Promise<VQueryT.ToggleOneResult<T>>;
    removeCollection(collection: string): Promise<boolean>;
}
