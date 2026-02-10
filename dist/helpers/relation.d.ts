import { Search } from "../types/arg.js";
import { DbFindOpts } from "../types/options.js";
import { RelationTypes } from "../types/relation.js";
export declare function pickByPath(obj: any, paths: string[][]): any;
export declare function autoSelect(rel: RelationTypes.RelationConfig, key: string): [string[] | undefined, boolean];
export declare function convertSearchObjToSearchArray(obj: Record<string, any>, parentKeys?: string[]): string[][];
export declare function processRelations(dbs: RelationTypes.DBS, cfg: RelationTypes.Relation, data: any, parentList?: any[] | null): Promise<void>;
export declare class Relation {
    dbs: RelationTypes.DBS;
    constructor(dbs: RelationTypes.DBS);
    findOne(path: RelationTypes.Path, search: Search, relations: RelationTypes.Relation, select?: string[][] | Record<string, any>): Promise<any>;
    find(path: RelationTypes.Path, search: Search, relations: RelationTypes.Relation, select?: string[][] | Record<string, any>, dbFindOpts?: DbFindOpts): Promise<any[]>;
}
