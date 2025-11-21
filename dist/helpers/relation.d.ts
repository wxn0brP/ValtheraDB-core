import { Search } from "../types/arg";
import { DbFindOpts } from "../types/options";
import { RelationTypes } from "../types/relation";
declare class Relation {
    dbs: RelationTypes.DBS;
    constructor(dbs: RelationTypes.DBS);
    findOne(path: RelationTypes.Path, search: Search, relations: RelationTypes.Relation, select?: string[][] | Record<string, any>): Promise<any>;
    find(path: RelationTypes.Path, search: Search, relations: RelationTypes.Relation, select?: string[][] | Record<string, any>, dbFindOpts?: DbFindOpts): Promise<any[]>;
}
export default Relation;
