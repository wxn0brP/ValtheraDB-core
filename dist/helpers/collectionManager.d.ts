import { Arg, Search, Updater } from "../types/arg";
import { DbFindOpts, FindOpts } from "../types/options";
import { VContext } from "../types/types";
import Data from "../types/data";
import { UpdateOneOrAdd, ValtheraCompatible } from "../types/valthera";
export declare class CollectionManager<D = Data> {
    private db;
    private collection;
    constructor(db: ValtheraCompatible, collection: string);
    add(data: Arg<D>, id_gen?: boolean): Promise<D>;
    find(search?: Search<D>, options?: DbFindOpts<D>, findOpts?: FindOpts<D>, context?: VContext): Promise<D[]>;
    findOne(search?: Search<D>, findOpts?: FindOpts<D>, context?: VContext): Promise<D>;
    update(search: Search<D>, updater: Updater<D>, context?: VContext): Promise<boolean>;
    updateOne(search: Search<D>, updater: Updater<D>, context?: VContext): Promise<boolean>;
    remove(search: Search<D>, context?: VContext): Promise<boolean>;
    removeOne(search: Search<D>, context?: VContext): Promise<boolean>;
    updateOneOrAdd(search: Search<D>, updater: Updater<D>, { add_arg, context, id_gen }?: UpdateOneOrAdd<D>): Promise<boolean>;
    toggleOne(search: Search<D>, data?: Arg<D>, context?: VContext): Promise<boolean>;
}
