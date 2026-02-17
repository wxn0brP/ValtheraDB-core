import { CustomFileCpu } from "../customFileCpu";
import { Data } from "../types/data";
import { VQuery } from "../types/query";
import { ActionsBase } from "./actions";
export declare abstract class CustomActionsBase extends ActionsBase {
    fileCpu: CustomFileCpu;
    constructor();
    add(query: VQuery): Promise<import("../types/arg").Arg<Data>>;
    find(query: VQuery): Promise<Data[]>;
    findOne({ collection, search, context, findOpts }: VQuery): Promise<Data>;
    update({ collection, search, updater, context }: VQuery): Promise<Data[]>;
    updateOne({ collection, search, updater, context }: VQuery): Promise<Data>;
    remove({ collection, search, context }: VQuery): Promise<Data[]>;
    removeOne({ collection, search, context }: VQuery): Promise<Data>;
}
