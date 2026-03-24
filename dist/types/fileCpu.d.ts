import { DataInternal } from "./data";
import { VQueryT } from "./query";
export interface FileCpu {
    add(file: string, config: VQueryT.Add): Promise<void>;
    find(file: string, config: VQueryT.Find): Promise<DataInternal[]>;
    findOne(file: string, config: VQueryT.FindOne): Promise<DataInternal | false>;
    remove(file: string, config: VQueryT.Remove, one: boolean): Promise<DataInternal[]>;
    update(file: string, config: VQueryT.Update, one: boolean): Promise<DataInternal[]>;
}
