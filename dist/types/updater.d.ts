import { DeepPartial, NestedValue } from "./utils";
export type ArrayUpdater<T = any> = {
    $push?: NestedValue<T, any>;
    $pushset?: NestedValue<T, any>;
    $pull?: NestedValue<T, any>;
    $pullall?: NestedValue<T, any>;
};
export type ObjectUpdater<T = any> = {
    $merge?: NestedValue<T, any>;
    $deepMerge?: NestedValue<T, any>;
};
export type ValueUpdater<T = any> = {
    $inc?: NestedValue<T, number>;
    $dec?: NestedValue<T, number>;
    $unset?: NestedValue<T, any>;
    $rename?: NestedValue<T, any>;
    $set?: NestedValue<T, any>;
};
export type UpdaterArg<T = any> = ArrayUpdater<T> & ObjectUpdater<T> & ValueUpdater<T> & DeepPartial<T> & Record<string, any>;
