import { Data } from "../types/data.js";
import { VQuery } from "../types/query.js";
export declare class ActionsBase {
    _inited: boolean;
    numberId: boolean;
    init(...args: any[]): Promise<void>;
    getCollections(): Promise<string[]>;
    ensureCollection(config: VQuery): Promise<boolean>;
    issetCollection(config: VQuery): Promise<boolean>;
    add(config: VQuery): Promise<Data>;
    find(config: VQuery): Promise<Data[]>;
    findOne(config: VQuery): Promise<Data | null>;
    update(config: VQuery): Promise<Data>;
    updateOne(config: VQuery): Promise<Data>;
    remove(config: VQuery): Promise<Data>;
    removeOne(config: VQuery): Promise<Data>;
    removeCollection(config: VQuery): Promise<boolean>;
    updateOneOrAdd(config: VQuery): Promise<boolean>;
    toggleOne(config: VQuery): Promise<boolean>;
}
