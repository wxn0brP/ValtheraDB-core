import { Data } from "../types/data.js";
import { FileCpu } from "../types/fileCpu.js";
import { VQueryT } from "../types/query.js";
export declare function findUtil(query: VQueryT.Find, fileCpuOrData: FileCpu | Object[], files: string[]): Promise<Data[]>;
