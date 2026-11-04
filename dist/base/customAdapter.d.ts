import { Data } from "../types/data";
import { VQueryT } from "../types/query";
import { AdapterBase } from "./adapter";
import { CustomFileCpu } from "./customFileCpu";
export declare abstract class CustomAdapterBase extends AdapterBase {
    fileCpu: CustomFileCpu;
    add(query: VQueryT.Add): Promise<import("../types/arg").Arg<Data>>;
    find(query: VQueryT.Find): Promise<Data[]>;
    findOne(query: VQueryT.FindOne): Promise<Data>;
    update(query: VQueryT.Update): Promise<import("../types/data").DataInternal[]>;
    updateOne(query: VQueryT.Update): Promise<import("../types/data").DataInternal | null>;
    remove(query: VQueryT.Remove): Promise<import("../types/data").DataInternal[]>;
    removeOne(query: VQueryT.Remove): Promise<import("../types/data").DataInternal | null>;
}
export { CustomAdapterBase as CustomActionsBase, };
