import { setDataForToggleOne, setDataForUpdateOneOrAdd } from "../helpers/assignDataPush";
import { ActionsBaseInterface } from "../types/action";
import { DataInternal } from "../types/data";
import { ToggleOneResult, UpdateOneOrAddResult, VQuery } from "../types/query";

export abstract class ActionsBase implements ActionsBaseInterface {
    _inited: boolean = true;
    numberId: boolean = false;
    async init(...args: any[]) { }

    abstract getCollections(): Promise<string[]>;
    abstract ensureCollection(config: VQuery): Promise<boolean>;
    abstract issetCollection(config: VQuery): Promise<boolean>;
    abstract add(config: VQuery): Promise<DataInternal>;
    abstract find(config: VQuery): Promise<DataInternal[]>;
    abstract findOne(config: VQuery): Promise<DataInternal | null>;
    abstract update(config: VQuery): Promise<DataInternal[] | null>;
    abstract updateOne(config: VQuery): Promise<DataInternal | null>;
    abstract remove(config: VQuery): Promise<DataInternal[] | null>;
    abstract removeOne(config: VQuery): Promise<DataInternal | null>;
    abstract removeCollection(config: VQuery): Promise<boolean>;

    async updateOneOrAdd(config: VQuery): Promise<UpdateOneOrAddResult<DataInternal>> {
        const res = await this.updateOne(config);

        if (res)
            return {
                data: res,
                type: "updated"
            }

        setDataForUpdateOneOrAdd(config);

        return {
            data: await this.add(config),
            type: "added"
        }
    }

    async toggleOne(config: VQuery): Promise<ToggleOneResult<DataInternal>> {
        const res = await this.removeOne(config);

        if (res)
            return {
                data: res,
                type: "removed"
            }

        setDataForToggleOne(config);

        return {
            data: await this.add(config),
            type: "added"
        }
    }
}
