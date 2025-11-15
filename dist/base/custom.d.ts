import CustomFileCpu from "../customFileCpu";
import Data from "../types/data";
import { VQuery } from "../types/query";
import ActionsBase from "./actions";
export declare class CustomActionsBase extends ActionsBase {
    fileCpu: CustomFileCpu;
    constructor();
    add(query: VQuery): Promise<import("../types/arg").Arg>;
    find(query: VQuery): Promise<Data[]>;
    findOne({ collection, search, context, findOpts }: VQuery): Promise<Data>;
    update({ collection, search, updater, context }: VQuery): Promise<boolean>;
    updateOne({ collection, search, updater, context }: VQuery): Promise<boolean>;
    remove({ collection, search, context }: VQuery): Promise<boolean>;
    removeOne({ collection, search, context }: VQuery): Promise<boolean>;
}
