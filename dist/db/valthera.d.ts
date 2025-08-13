import { VEE } from "@wxn0brp/event-emitter";
import ActionsBase from "../base/actions";
import CollectionManager from "../helpers/CollectionManager";
import executorC from "../helpers/executor";
import { Arg, Search, Updater } from "../types/arg";
import Data from "../types/data";
import { DbFindOpts, DbOpts, FindOpts } from "../types/options";
import { VQuery } from "../types/query";
import { VContext } from "../types/types";
import { ValtheraCompatible } from "../types/valthera";
type DbActionsFns = keyof {
    [K in keyof ActionsBase as ActionsBase[K] extends (...args: any[]) => any ? K : never]: any;
};
declare class ValtheraClass implements ValtheraCompatible {
    dbAction: ActionsBase;
    executor: executorC;
    emiter: VEE;
    version: string;
    constructor(options?: DbOpts);
    init(...args: any[]): Promise<unknown>;
    execute<T>(name: DbActionsFns, query: VQuery): Promise<T>;
    c<T = Data>(collection: string): CollectionManager<T>;
    getCollections(): Promise<string[]>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    add<T extends object>(collection: string, data: T, id_gen?: true): Promise<T & {
        _id: string;
    }>;
    add<T extends object>(collection: string, data: T, id_gen: false): Promise<T>;
    find<T = Data>(collection: string, search?: Search<T>, context?: VContext, dbFindOpts?: DbFindOpts<T>, findOpts?: FindOpts<T>): Promise<T[]>;
    findOne<T = Data>(collection: string, search?: Search<T>, context?: VContext, findOpts?: FindOpts<T>): Promise<T>;
    update<T = Data>(collection: string, search: Search<T>, updater: Updater<T>, context?: {}): Promise<boolean>;
    updateOne<T = Data>(collection: string, search: Search<T>, updater: Updater<T>, context?: VContext): Promise<boolean>;
    remove<T = Data>(collection: string, search: Search<T>, context?: VContext): Promise<boolean>;
    removeOne<T = Data>(collection: string, search: Search<T>, context?: VContext): Promise<boolean>;
    updateOneOrAdd<T = Data>(collection: string, search: Search<T>, updater: Updater<T>, add_arg?: Arg, context?: VContext, id_gen?: boolean): Promise<boolean>;
    removeCollection(collection: string): Promise<boolean>;
}
export default ValtheraClass;
