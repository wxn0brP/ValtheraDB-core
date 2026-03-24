import { ActionsBaseInterface } from "../types/action";
import { DataInternal } from "../types/data";
import { VQueryT } from "../types/query";
export declare abstract class ActionsBase implements ActionsBaseInterface {
    _inited: boolean;
    numberId: boolean;
    init(...args: any[]): Promise<void>;
    abstract getCollections(): Promise<string[]>;
    abstract ensureCollection(collection: string): Promise<boolean>;
    abstract issetCollection(collection: string): Promise<boolean>;
    abstract removeCollection(collection: string): Promise<boolean>;
    abstract add(config: VQueryT.Add): Promise<DataInternal>;
    abstract find(config: VQueryT.Find): Promise<DataInternal[]>;
    abstract findOne(config: VQueryT.FindOne): Promise<DataInternal | null>;
    abstract update(config: VQueryT.Update): Promise<DataInternal[]>;
    abstract updateOne(config: VQueryT.Update): Promise<DataInternal | null>;
    abstract remove(config: VQueryT.Remove): Promise<DataInternal[]>;
    abstract removeOne(config: VQueryT.Remove): Promise<DataInternal | null>;
    updateOneOrAdd(config: VQueryT.UpdateOneOrAdd): Promise<VQueryT.UpdateOneOrAddResult<DataInternal>>;
    toggleOne(config: VQueryT.ToggleOne): Promise<VQueryT.ToggleOneResult<DataInternal>>;
}
