import { Id } from "../types/Id";
export declare function getIdData(): {
    usedIds: Map<any, any>;
    lastId: Id;
    recentIdsTimestamps: number[];
    startIndex: number;
    lastGeneratedMs: number;
    lastRandomValue: number;
};
export type IdData = ReturnType<typeof getIdData>;
export declare function genId(parts?: number[], idData?: {
    usedIds: Map<any, any>;
    lastId: Id;
    recentIdsTimestamps: number[];
    startIndex: number;
    lastGeneratedMs: number;
    lastRandomValue: number;
}): Id;
