import { VEE } from "@wxn0brp/event-emitter";
import { ActionsBase } from "../base/actions";
import { Collection } from "../helpers/collection";
import { ExecutorInterface } from "../helpers/executor";
import { Data } from "../types/data";
import { DbOpts } from "../types/options";
import { ValtheraPlugin } from "../types/plugin";
import { VQuery, VQueryT } from "../types/query";
import { ValtheraCompatible } from "../types/valthera";
export declare class ValtheraClass implements ValtheraCompatible {
    options: DbOpts;
    adapter: ActionsBase;
    executor: ExecutorInterface;
    emitter: VEE<{
        [K in keyof ValtheraCompatible]: (query: VQuery, result: Awaited<ReturnType<ValtheraCompatible[K]>>) => void;
    } & {
        "*": (name: keyof ValtheraCompatible, query: VQuery, result: any) => void;
    }>;
    emiter: VEE<{
        c: (query: VQuery, result: Collection<unknown>) => void;
        getCollections: (query: VQuery, result: string[]) => void;
        ensureCollection: (query: VQuery, result: boolean) => void;
        issetCollection: (query: VQuery, result: boolean) => void;
        add: (query: VQuery, result: unknown) => void;
        find: (query: VQuery, result: unknown[]) => void;
        findOne: (query: VQuery, result: unknown) => void;
        update: (query: VQuery, result: unknown[]) => void;
        updateOne: (query: VQuery, result: unknown) => void;
        remove: (query: VQuery, result: unknown[]) => void;
        removeOne: (query: VQuery, result: unknown) => void;
        removeCollection: (query: VQuery, result: boolean) => void;
        updateOneOrAdd: (query: VQuery, result: VQueryT.UpdateOneOrAddResult<unknown>) => void;
        toggleOne: (query: VQuery, result: VQueryT.ToggleOneResult<unknown>) => void;
    } & {
        "*": (name: keyof ValtheraCompatible, query: VQuery, result: any) => void;
    }>;
    version: string;
    _plugins: ValtheraPlugin[];
    plugin(p: ValtheraPlugin): () => void;
    get dbAction(): ActionsBase;
    set dbAction(action: ActionsBase);
    constructor(options: DbOpts);
    init(...args: any[]): Promise<any>;
    close(...args: any[]): Promise<any>;
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
