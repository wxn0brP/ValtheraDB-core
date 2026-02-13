import { DataInternal } from "./data";
import { VQuery } from "./query";

export interface ActionsBaseInterface {
    _inited: boolean;
    numberId: boolean;
    init(...args: any[]): Promise<void>;
    getCollections(): Promise<string[]>;
    ensureCollection(config: VQuery): Promise<boolean>;
    issetCollection(config: VQuery): Promise<boolean>;
    add(config: VQuery): Promise<DataInternal>;
    find(config: VQuery): Promise<DataInternal[]>;
    findOne(config: VQuery): Promise<DataInternal | null>;
    update(config: VQuery): Promise<DataInternal[] | null>;
    updateOne(config: VQuery): Promise<DataInternal | null>;
    remove(config: VQuery): Promise<DataInternal[] | null>;
    removeOne(config: VQuery): Promise<DataInternal | null>;
    removeCollection(config: VQuery): Promise<boolean>;
    updateOneOrAdd(config: VQuery): Promise<DataInternal>;
    toggleOne(config: VQuery): Promise<DataInternal | null>;
}
