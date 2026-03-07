import { Arg, Search, Updater } from "../types/arg";
import { UpdateOneOrAdd } from "../types/collection";
import { Data } from "../types/data";
import { DbFindOpts, FindOpts } from "../types/options";
import { ToggleOneResult, UpdateOneOrAddResult } from "../types/query";
import { VContext } from "../types/types";
import { ValtheraCompatible } from "../types/valthera";
export declare class Collection<D = Data> {
    db: ValtheraCompatible;
    collection: string;
    constructor(db: ValtheraCompatible, collection: string);
    add(data: Arg<D>, id_gen: false): Promise<D>;
    add(data: Arg<D>, id_gen?: true): Promise<D & {
        _id: string;
    }>;
    find(search?: Search<D>, options?: DbFindOpts<D>, findOpts?: FindOpts<D>, context?: VContext): Promise<D[]>;
    findOne(search?: Search<D>, findOpts?: FindOpts<D>, context?: VContext): Promise<D>;
    update(search: Search<D>, updater: Updater<D>, context?: VContext): Promise<D[]>;
    updateOne(search: Search<D>, updater: Updater<D>, context?: VContext): Promise<D | null>;
    remove(search: Search<D>, context?: VContext): Promise<D[]>;
    removeOne(search: Search<D>, context?: VContext): Promise<D | null>;
    updateOneOrAdd(search: Search<D>, updater: Updater<D>, { add_arg, context, id_gen }?: UpdateOneOrAdd<D>): Promise<UpdateOneOrAddResult<D>>;
    toggleOne(search: Search<D>, data?: Arg<D>, context?: VContext): Promise<ToggleOneResult<D>>;
}
