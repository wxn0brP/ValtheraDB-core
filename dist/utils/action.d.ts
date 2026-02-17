import { Data } from "../types/data";
import { FileCpu } from "../types/fileCpu";
import { VQuery } from "../types/query";
export declare function findUtil(query: VQuery, fileCpu: FileCpu, files: string[]): Promise<Data[]>;
