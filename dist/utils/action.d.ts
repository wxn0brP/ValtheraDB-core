import { Data } from "../types/data.js";
import { FileCpu } from "../types/fileCpu.js";
import { VQuery } from "../types/query.js";
export declare function findUtil(query: VQuery, fileCpu: FileCpu, files: string[]): Promise<Data[]>;
