import { VQueryT } from "../types/query.js";
export declare function applyAddDefaults<T>(q: VQueryT.Add<T>): void;
export declare function applyFindDefaults<T>(q: VQueryT.Find<T>): void;
export declare function applyFindOneDefaults<T>(q: VQueryT.FindOne<T>): void;
export declare function applyUpdateDefaults<T>(q: VQueryT.Update<T>): void;
export declare function applyRemoveDefaults<T>(q: VQueryT.Remove<T>): void;
export declare function applyUpdateOneOrAddDefaults<T>(q: VQueryT.UpdateOneOrAdd<T>): void;
export declare function applyToggleOneDefaults<T>(q: VQueryT.ToggleOne<T>): void;
