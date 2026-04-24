import { Data } from "../types/data";
import { FileCpu } from "../types/fileCpu";
import { VQueryT } from "../types/query";
export declare function findUtil(query: VQueryT.Find, fileCpuOrData: FileCpu | Object[], files: string[]): Promise<Data[]>;
