import { Data } from "../types/data";
import { FileCpu } from "../types/fileCpu";
import { VQueryT } from "../types/query";
export declare function findUtil(query: VQueryT.Find, fileCpu: FileCpu, files: string[]): Promise<Data[]>;
