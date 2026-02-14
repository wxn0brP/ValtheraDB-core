import { Search, Updater } from "./arg";
import { Data, DataInternal } from "./data";
import { FindOpts } from "./options";
import { VContext } from "./types";
export interface FileCpu {
    add(file: string, data: Data): Promise<void>;
    find(file: string, search: Search, context?: VContext, findOpts?: FindOpts): Promise<DataInternal[]>;
    findOne(file: string, search: Search, context?: VContext, findOpts?: FindOpts): Promise<DataInternal | false>;
    remove(file: string, one: boolean, search: Search, context?: VContext): Promise<DataInternal[]>;
    update(file: string, one: boolean, search: Search, updater: Updater, context?: VContext): Promise<DataInternal[]>;
}
