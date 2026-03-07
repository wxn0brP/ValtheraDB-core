import { DataInternal } from "./data";
import * as Query from "./query";
export interface FileCpu {
    add(config: Query.AddQuery): Promise<void>;
    find(config: Query.FindQuery): Promise<DataInternal[]>;
    findOne(config: Query.FindOneQuery): Promise<DataInternal | false>;
    remove(config: Query.RemoveQuery, one: boolean): Promise<DataInternal[]>;
    update(config: Query.UpdateQuery, one: boolean): Promise<DataInternal[]>;
}
