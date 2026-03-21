import { setDataForToggleOne, setDataForUpdateOneOrAdd } from "../helpers/assignDataPush";
import { ActionsBaseInterface } from "../types/action";
import { DataInternal } from "../types/data";
import { VQueryT } from "../types/query";

export abstract class ActionsBase implements ActionsBaseInterface {
    _inited: boolean = true;
    numberId: boolean = false;
    async init(...args: any[]) { }

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

    async updateOneOrAdd(config: VQueryT.UpdateOneOrAdd): Promise<VQueryT.UpdateOneOrAddResult<DataInternal>> {
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

    async toggleOne(config: VQueryT.ToggleOne): Promise<VQueryT.ToggleOneResult<DataInternal>> {
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
