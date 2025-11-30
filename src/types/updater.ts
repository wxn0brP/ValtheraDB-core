import { DeepPartial, NestedValue } from "./utils";

/** Arrays */
export type ArrayUpdater<T = any> = {
    /** [1,2] -> $push 3 -> [1,2,3] */
    $push?: NestedValue<T, any>,
    /** [1,2] -> $pushset 2,3 -> [1,2,3] */
    $pushset?: NestedValue<T, any>,
    /** [1,2,3] -> $pull 2 -> [1,3] */
    $pull?: NestedValue<T, any>,
    /** [1,2,2,3] -> $pullall [2] -> [1,3] */
    $pullall?: NestedValue<T, any>,
}

/** Objects */
export type ObjectUpdater<T = any> = {
    /** { a: 1 } -> $merge { b: 2 } -> { a: 1, b: 2 } */
    $merge?: NestedValue<T, any>,
    /** { a: { x: 1 } } -> $deepMerge { a: { y: 2 } } -> { a: { x: 1, y: 2 } } */
    $deepMerge?: NestedValue<T, any>,
}

/** Values */
export type ValueUpdater<T = any> = {
    /** { count: 1 } -> $inc 2 -> { count: 3 } */
    $inc?: NestedValue<T, number>,
    /** { count: 5 } -> $dec 2 -> { count: 3 } */
    $dec?: NestedValue<T, number>,
    /** { name: "John" } -> $unset "name" -> {} */
    $unset?: NestedValue<T, any>,
    /** { oldName: "value" } -> $rename "oldName" to "newName" -> { newName: "value" } */
    $rename?: NestedValue<T, any>,
    /** 
     * {} -> $set { name: "John" } -> { name: "John" } 
     * 
     * Note: same as { name: value } 
     */
    $set?: NestedValue<T, any>,
}


export type UpdaterArg<T = any> =
    ArrayUpdater<T> &
    ObjectUpdater<T> &
    ValueUpdater<T> &
    DeepPartial<T> &
    Record<string, any>;