import { Id } from "../types/Id.js";
export declare function getIdData(): {
    usedIds: Map<any, any>;
    lastId: Id;
    recentIdsTimestamps: number[];
    startIndex: number;
    lastGeneratedMs: number;
    lastRandomValue: number;
};
export type IdData = ReturnType<typeof getIdData>;
/**
 * Generates a unique random identifier based on time and parts.
 *
 * @param {number[]} [parts] - an array of lengths of parts of the identifier
 * @returns {Id} - a new unique identifier
 */
export declare function genId(parts?: number[], idData?: {
    usedIds: Map<any, any>;
    lastId: Id;
    recentIdsTimestamps: number[];
    startIndex: number;
    lastGeneratedMs: number;
    lastRandomValue: number;
}): Id;
