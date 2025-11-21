/**
 * Predefined type for updating data.
 */
import { Arg } from "./arg.js";
import { PartialOfType } from "./utils.js";
/** Arrays */
export type ArrayUpdater<T = any> = {
    $push?: PartialOfType<T, any>;
    /** Pushes items into an array and removes duplicates */
    $pushset?: PartialOfType<T, any>;
    $pull?: PartialOfType<T, any>;
    $pullall?: PartialOfType<T, any>;
};
/** Objects */
export type ObjectUpdater<T = any> = {
    $merge?: PartialOfType<T, any>;
    $deepMerge?: PartialOfType<T, any>;
};
/** Values */
export type ValueUpdater<T = any> = {
    $inc?: PartialOfType<T, number>;
    $dec?: PartialOfType<T, number>;
    $unset?: PartialOfType<T, any>;
    $rename?: PartialOfType<T, any>;
    /** same as { name: value } */
    $set?: PartialOfType<T, any>;
};
export type UpdaterArg<T = any> = ArrayUpdater<T> & ObjectUpdater<T> & ValueUpdater<T> & Arg<T>;
