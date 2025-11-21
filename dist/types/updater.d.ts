import { Arg } from "./arg";
import { PartialOfType } from "./utils";
export type ArrayUpdater<T = any> = {
    $push?: PartialOfType<T, any>;
    $pushset?: PartialOfType<T, any>;
    $pull?: PartialOfType<T, any>;
    $pullall?: PartialOfType<T, any>;
};
export type ObjectUpdater<T = any> = {
    $merge?: PartialOfType<T, any>;
    $deepMerge?: PartialOfType<T, any>;
};
export type ValueUpdater<T = any> = {
    $inc?: PartialOfType<T, number>;
    $dec?: PartialOfType<T, number>;
    $unset?: PartialOfType<T, any>;
    $rename?: PartialOfType<T, any>;
    $set?: PartialOfType<T, any>;
};
export type UpdaterArg<T = any> = ArrayUpdater<T> & ObjectUpdater<T> & ValueUpdater<T> & Arg<T>;
