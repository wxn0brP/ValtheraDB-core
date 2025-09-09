import { Arg, Search, Updater } from "../types/arg";
import { DbFindOpts, FindOpts } from "../types/options";
import { VContext } from "../types/types";
import Data from "../types/data";
import { UpdateOneOrAdd, ValtheraCompatible } from "../types/valthera";
declare class CollectionManager<D = Data> {
    private db;
    private collection;
    constructor(db: ValtheraCompatible, collection: string);
    add<T = Data>(data: Arg<T & D>, id_gen?: boolean): Promise<T>;
    find<T = Data>(search?: Search<T & D>, options?: DbFindOpts<T & Data>, findOpts?: FindOpts<T & Data>, context?: VContext): Promise<T[]>;
    findOne<T = Data>(search?: Search<T & Data>, findOpts?: FindOpts<T & Data>, context?: VContext): Promise<T>;
    update<T = Data>(search: Search<T & Data>, updater: Updater<T & Data>, context?: VContext): Promise<boolean>;
    updateOne<T = Data>(search: Search<T & Data>, updater: Updater<T & Data>, context?: VContext): Promise<boolean>;
    remove<T = Data>(search: Search<T & Data>, context?: VContext): Promise<boolean>;
    removeOne<T = Data>(search: Search<T & Data>, context?: VContext): Promise<boolean>;
    updateOneOrAdd<T = Data>(search: Search<T & Data>, updater: Updater<T & Data>, { add_arg, context, id_gen }: UpdateOneOrAdd<T & Data>): Promise<boolean>;
}
export default CollectionManager;
