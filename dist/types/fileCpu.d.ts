import { DataInternal } from "./data";
import { VQueryT } from "./query";
export interface FileCpu {
    add(file: string, config: VQueryT.Add, opts?: any): Promise<void>;
    find(file: string, config: VQueryT.Find, opts?: any): Promise<DataInternal[]>;
    findOne(file: string, config: VQueryT.FindOne, opts?: any): Promise<DataInternal | false>;
    remove(file: string, config: VQueryT.Remove, one: boolean, opts?: any): Promise<DataInternal[]>;
    update(file: string, config: VQueryT.Update, one: boolean, opts?: any): Promise<DataInternal[]>;
}
