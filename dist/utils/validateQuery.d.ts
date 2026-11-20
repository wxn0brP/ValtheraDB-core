import { VQuery } from "../types/query";
export declare function validateSearch(search: unknown): void;
export declare function validateUpdater(updater: unknown): void;
export declare function validateQuery(query: VQuery | string | undefined, op?: string): void;
export declare function collectOperators(value: unknown): Set<string>;
