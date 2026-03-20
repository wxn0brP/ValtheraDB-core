import { Data } from "../types/data.js";
import { FileCpu } from "../types/fileCpu.js";
import { FindQuery } from "../types/query.js";
export declare function findUtil(query: FindQuery, fileCpu: FileCpu, files: string[]): Promise<Data[]>;
