import { IsStrict } from "./config";
import { DeepPartial, FieldsOf, NestedValue, WithId } from "./utils";
export type ArrayUpdater<T = any> = {
    $push?: NestedValue<T, any>;
    $pushSet?: NestedValue<T, any>;
    $pushAll?: NestedValue<T, any>;
    $pull?: NestedValue<T, any>;
    $pullAll?: NestedValue<T, any>;
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
    $set?: IsStrict extends true ? FieldsOf<T> : NestedValue<T, any>;
};
export type UpdaterArg<T = any> = IsStrict extends true ? ArrayUpdater<WithId<T>> & ObjectUpdater<WithId<T>> & ValueUpdater<WithId<T>> & FieldsOf<WithId<T>> : ArrayUpdater<T> & ObjectUpdater<T> & ValueUpdater<T> & DeepPartial<T> & Record<string, any>;
