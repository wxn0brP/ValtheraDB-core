import { Collection } from "../helpers/collection";
import { Arg } from "./arg";
import { Data } from "./data";
import { VQuery } from "./query";
import { VContext } from "./types";

export type QueryBase = Required<Pick<VQuery, "collection" | "search">> & Pick<VQuery, "control">;
export type AddQuery = Required<Pick<VQuery, "data" | "collection">> & Pick<VQuery, "id_gen" | "control">;
export type FindQuery = QueryBase & Pick<VQuery, "findOpts" | "dbFindOpts" | "context">;
export type FindOneQuery = QueryBase & Pick<VQuery, "findOpts" | "context">;
export type UpdateQuery = QueryBase & Required<Pick<VQuery, "updater">> & Pick<VQuery, "context">;
export type RemoveQuery = QueryBase & Pick<VQuery, "context">;
export type UpdateOneOrAddQuery = QueryBase & UpdateQuery & Pick<VQuery, "add_arg" | "id_gen">;
export type ToggleOneQuery = QueryBase & Pick<VQuery, "data" | "context">;

export interface ValtheraCompatible {
    c(collection: string): Collection;
    getCollections(): Promise<string[]>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    add<T = Data>(query: AddQuery): Promise<T>;
    find<T = Data>(query: FindQuery): Promise<T[]>;
    findOne<T = Data>(query: FindOneQuery): Promise<T | null>;
    update<T = Data>(query: UpdateQuery): Promise<T[] | null>;
    updateOne<T = Data>(query: UpdateQuery): Promise<T | null>;
    remove<T = Data>(query: RemoveQuery): Promise<T[] | null>;
    removeOne<T = Data>(query: RemoveQuery): Promise<T | null>;
    removeCollection(collection: string): Promise<boolean>;
    updateOneOrAdd<T = Data>(query: UpdateOneOrAddQuery): Promise<T>;
    toggleOne<T = Data>(query: ToggleOneQuery): Promise<T | null>;
}

export interface UpdateOneOrAdd<T> {
    add_arg?: Arg<T>;
    id_gen?: boolean;
    context?: VContext;
}