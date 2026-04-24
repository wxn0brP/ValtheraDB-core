import { CustomFileCpu } from "../customFileCpu";
import { Data } from "../types/data";
import { VQueryT } from "../types/query";
import { ActionsBase } from "./actions";
export declare abstract class CustomActionsBase extends ActionsBase {
    fileCpu: CustomFileCpu;
    constructor();
    add(query: VQueryT.Add): Promise<import("../types/arg").Arg<Data>>;
    find(query: VQueryT.Find): Promise<Data[]>;
    findOne(query: VQueryT.FindOne): Promise<Data>;
    update(query: VQueryT.Update): Promise<Data[]>;
    updateOne(query: VQueryT.Update): Promise<Data>;
    remove(query: VQueryT.Remove): Promise<Data[]>;
    removeOne(query: VQueryT.Remove): Promise<Data>;
}
