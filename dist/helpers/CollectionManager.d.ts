import { Arg, Search, Updater } from "../types/arg";
import { DbFindOpts, FindOpts } from "../types/options";
import { VContext } from "../types/types";
import Data from "../types/data";
import { ValtheraCompatible } from "../types/valthera";
declare class CollectionManager {
    private db;
    private collection;
    constructor(db: ValtheraCompatible, collection: string);
    add<T = Data>(data: Arg, id_gen?: boolean): Promise<T>;
    find<T = Data>(search: Search, context?: VContext, options?: DbFindOpts, findOpts?: FindOpts): Promise<T[]>;
    findOne<T = Data>(search: Search, context?: VContext, findOpts?: FindOpts): Promise<T>;
    update(search: Search, updater: Updater, context?: VContext): Promise<boolean>;
    updateOne(search: Search, updater: Updater, context?: VContext): Promise<boolean>;
    remove(search: Search, context?: VContext): Promise<boolean>;
    removeOne(search: Search, context?: VContext): Promise<boolean>;
    updateOneOrAdd(search: Search, updater: Updater, add_arg?: Arg, context?: VContext, id_gen?: boolean): Promise<boolean>;
}
export default CollectionManager;
