import { setDataForToggleOne, setDataForUpdateOneOrAdd } from "../helpers/assignDataPush";
import { ActionsBaseInterface } from "../types/action";
import { DataInternal } from "../types/data";
import * as Query from "../types/query";


export abstract class ActionsBase implements ActionsBaseInterface {
    _inited: boolean = true;
    numberId: boolean = false;
    async init(...args: any[]) { }

    abstract getCollections(): Promise<string[]>;
    abstract ensureCollection(collection: string): Promise<boolean>;
    abstract issetCollection(collection: string): Promise<boolean>;
    abstract removeCollection(collection: string): Promise<boolean>;

    abstract add(config: Query.AddQuery): Promise<DataInternal>;
    abstract find(config: Query.FindQuery): Promise<DataInternal[]>;
    abstract findOne(config: Query.FindOneQuery): Promise<DataInternal | null>;
    abstract update(config: Query.UpdateQuery): Promise<DataInternal[]>;
    abstract updateOne(config: Query.UpdateQuery): Promise<DataInternal | null>;
    abstract remove(config: Query.RemoveQuery): Promise<DataInternal[]>;
    abstract removeOne(config: Query.RemoveQuery): Promise<DataInternal | null>;

    async updateOneOrAdd(config: Query.UpdateOneOrAddQuery): Promise<Query.UpdateOneOrAddResult<DataInternal>> {
        const res = await this.updateOne(config);

        if (res)
            return {
                data: res,
                type: "updated"
            }

        // transform UpdateOneQuery to AddQuery
        setDataForUpdateOneOrAdd(config);

        return {
            data: await this.add(config as any),
            type: "added"
        }
    }

    async toggleOne(config: Query.ToggleOneQuery): Promise<Query.ToggleOneResult<DataInternal>> {
        const res = await this.removeOne(config);

        if (res)
            return {
                data: res,
                type: "removed"
            }

        // transform ToggleOneQuery to AddQuery
        setDataForToggleOne(config);

        return {
            data: await this.add(config as any),
            type: "added"
        }
    }
}
