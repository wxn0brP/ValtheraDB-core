import { setDataForToggleOne, setDataForUpdateOneOrAdd } from "../helpers/assignDataPush";
import { ActionsBaseInterface } from "../types/action";
import { DataInternal } from "../types/data";
import { VQuery } from "../types/query";

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

    async updateOneOrAdd(config: VQuery): Promise<DataInternal> {
        const res = await this.updateOne(config);

        const controlData = { updated: true };
        config.control ||= {};
        config.control.updateOneOrAdd = controlData;

        if (res) return res;

        setDataForUpdateOneOrAdd(config);
        config.control.updateOneOrAdd.updated = false;
        return await this.add(config);
    }

    async toggleOne(config: VQuery): Promise<DataInternal | null> {
        const res = await this.removeOne(config);

        const controlData = { created: false };
        config.control ||= {};
        config.control.toggleOne = controlData;

        if (res) return res;

        setDataForToggleOne(config);
        config.control.toggleOne.created = true;
        return await this.add(config);
    }
}
