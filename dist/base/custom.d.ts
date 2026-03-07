import { CustomFileCpu } from "../customFileCpu";
import { Data } from "../types/data";
import * as Query from "../types/query";
import { ActionsBase } from "./actions";
export declare abstract class CustomActionsBase extends ActionsBase {
    fileCpu: CustomFileCpu;
    constructor();
    add(query: Query.AddQuery): Promise<import("../types/arg").Arg<Data>>;
    find(query: Query.FindQuery): Promise<Data[]>;
    findOne(query: Query.FindOneQuery): Promise<Data>;
    update(query: Query.UpdateQuery): Promise<Data[]>;
    updateOne(query: Query.UpdateQuery): Promise<Data>;
    remove(query: Query.RemoveQuery): Promise<Data[]>;
    removeOne(query: Query.RemoveQuery): Promise<Data>;
}
