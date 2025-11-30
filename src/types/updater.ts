/**
 * Predefined type for updating data.
 */

import { DeepPartial, NestedValue } from "./utils";

/** Arrays */
export type ArrayUpdater<T = any> = {
    $push?: NestedValue<T, any>,
    /** Pushes items into an array and removes duplicates */
    $pushset?: NestedValue<T, any>,
    $pull?: NestedValue<T, any>,
    $pullall?: NestedValue<T, any>,
}

/** Objects */
export type ObjectUpdater<T = any> = {
    $merge?: NestedValue<T, any>,
    $deepMerge?: NestedValue<T, any>,
}

/** Values */
export type ValueUpdater<T = any> = {
    $inc?: NestedValue<T, number>,
    $dec?: NestedValue<T, number>,
    $unset?: NestedValue<T, any>,
    $rename?: NestedValue<T, any>,
    /** same as { name: value } */
    $set?: NestedValue<T, any>,
}


export type UpdaterArg<T = any> =
    ArrayUpdater<T> &
    ObjectUpdater<T> &
    ValueUpdater<T> &
    DeepPartial<T> &
    Record<string, any>;