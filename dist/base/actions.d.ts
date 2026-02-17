import { ActionsBaseInterface } from "../types/action.js";
import { DataInternal } from "../types/data.js";
import { ToggleOneResult, UpdateOneOrAddResult, VQuery } from "../types/query.js";
export declare abstract class ActionsBase implements ActionsBaseInterface {
    _inited: boolean;
    numberId: boolean;
    init(...args: any[]): Promise<void>;
    abstract getCollections(): Promise<string[]>;
    abstract ensureCollection(config: VQuery): Promise<boolean>;
    abstract issetCollection(config: VQuery): Promise<boolean>;
    abstract add(config: VQuery): Promise<DataInternal>;
    abstract find(config: VQuery): Promise<DataInternal[]>;
    abstract findOne(config: VQuery): Promise<DataInternal | null>;
    abstract update(config: VQuery): Promise<DataInternal[]>;
    abstract updateOne(config: VQuery): Promise<DataInternal | null>;
    abstract remove(config: VQuery): Promise<DataInternal[]>;
    abstract removeOne(config: VQuery): Promise<DataInternal | null>;
    abstract removeCollection(config: VQuery): Promise<boolean>;
    updateOneOrAdd(config: VQuery): Promise<UpdateOneOrAddResult<DataInternal>>;
    toggleOne(config: VQuery): Promise<ToggleOneResult<DataInternal>>;
}
