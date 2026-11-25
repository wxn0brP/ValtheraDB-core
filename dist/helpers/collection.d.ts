import { Arg, Search, Updater } from "../types/arg";
import { Data } from "../types/data";
import { IndexOpts } from "../types/indexes";
import { DbFindOpts, FindOpts } from "../types/options";
import { VQueryT } from "../types/query";
import { UpdateOneOrAdd } from "../types/updateOneOrAdd";
import { ValtheraCompatible } from "../types/valthera";
export declare function resolveCollection(target: string | VQueryT.Collection): string;
export declare class Collection<D = Data> {
    db: ValtheraCompatible;
    collection: string;
    constructor(db: ValtheraCompatible, collection: string);
    add(data: Arg<D>, id_gen: false): Promise<D>;
    add(data: Arg<D>, id_gen?: true): Promise<D & {
        _id: string;
    }>;
    bulkAdd(data: Arg<D>[], id_gen: false): Promise<D[]>;
    bulkAdd(data: Arg<D>[], id_gen?: true): Promise<(D & {
        _id: string;
    })[]>;
    find(search?: Search<D>, options?: DbFindOpts<D>, findOpts?: FindOpts<D>): Promise<D[]>;
    findOne(search?: Search<D>, findOpts?: FindOpts<D>): Promise<D | null>;
    count(search?: Search<D>): Promise<number>;
    update(search: Search<D>, updater: Updater<D>): Promise<D[]>;
    updateOne(search: Search<D>, updater: Updater<D>): Promise<D | null>;
    remove(search: Search<D>): Promise<D[]>;
    removeOne(search: Search<D>): Promise<D | null>;
    updateOneOrAdd(search: Search<D>, updater: Updater<D>, { add_arg, id_gen }?: UpdateOneOrAdd<D>): import("./resultPromise").ResultPromise<VQueryT.UpdateOneOrAddResult<D>>;
    toggleOne(search: Search<D>, data?: Arg<D>): import("./resultPromise").ResultPromise<VQueryT.ToggleOneResult<D>>;
    createIndex(fields: string[], opts?: IndexOpts): Promise<void>;
    removeIndex(fields: string[]): Promise<void>;
}
