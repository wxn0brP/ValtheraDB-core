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
    find<T = Data>(search?: Search<T & D>, options?: DbFindOpts<T & D>, findOpts?: FindOpts<T & D>, context?: VContext): Promise<T[]>;
    findOne<T = Data>(search?: Search<T & D>, findOpts?: FindOpts<T & D>, context?: VContext): Promise<T>;
    update<T = Data>(search: Search<T & D>, updater: Updater<T & D>, context?: VContext): Promise<boolean>;
    updateOne<T = Data>(search: Search<T & D>, updater: Updater<T & D>, context?: VContext): Promise<boolean>;
    remove<T = Data>(search: Search<T & D>, context?: VContext): Promise<boolean>;
    removeOne<T = Data>(search: Search<T & D>, context?: VContext): Promise<boolean>;
    updateOneOrAdd<T = Data>(search: Search<T & D>, updater: Updater<T & D>, { add_arg, context, id_gen }?: UpdateOneOrAdd<T & D>): Promise<boolean>;
    toggleOne<T = Data>(search: Search<T & D>, data?: Arg<T & D>, context?: VContext): Promise<boolean>;
}
export default CollectionManager;
