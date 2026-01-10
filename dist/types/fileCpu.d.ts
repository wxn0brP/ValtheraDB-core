import { Search, Updater } from "./arg";
import Data from "./data";
import { FindOpts } from "./options";
import { VContext } from "./types";
interface FileCpu {
    add(file: string, data: Data): Promise<void>;
    find(file: string, search: Search, context?: VContext, findOpts?: FindOpts): Promise<any[] | false>;
    findOne(file: string, search: Search, context?: VContext, findOpts?: FindOpts): Promise<any | false>;
    remove(file: string, one: boolean, search: Search, context?: VContext): Promise<boolean>;
    update(file: string, one: boolean, search: Search, updater: Updater, context?: VContext): Promise<boolean>;
}
export default FileCpu;
