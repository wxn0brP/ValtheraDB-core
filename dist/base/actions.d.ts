import Data from "../types/data";
import { VQuery } from "../types/query";
declare class ActionsBase {
    _inited: boolean;
    numberId: boolean;
    init(...args: any[]): Promise<void>;
    getCollections(): Promise<string[]>;
    ensureCollection(config: VQuery): Promise<boolean>;
    issetCollection(config: VQuery): Promise<boolean>;
    add(config: VQuery): Promise<Data>;
    find(config: VQuery): Promise<Data[]>;
    findOne(config: VQuery): Promise<Data | null>;
    update(config: VQuery): Promise<boolean>;
    updateOne(config: VQuery): Promise<boolean>;
    remove(config: VQuery): Promise<boolean>;
    removeOne(config: VQuery): Promise<boolean>;
    removeCollection(config: VQuery): Promise<boolean>;
    updateOneOrAdd(config: VQuery): Promise<boolean>;
}
export default ActionsBase;
