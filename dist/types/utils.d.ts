export type KeysMatching<T, V, C = V> = {
    [K in keyof T]-?: T[K] extends C ? K : never;
}[keyof T];
export type PartialOfType<T, V, C = V> = Partial<Record<KeysMatching<T, V, C>, V>>;
export type PartialPickMatching<T, V, C = V> = Partial<Pick<T, KeysMatching<T, V, C>>>;
/** Helper type for nested path values with type filtering */
export type NestedValue<T, V, C = V> = {
    [K in keyof T as T[K] extends C ? K : T[K] extends object ? K : never]?: T[K] extends C ? V : T[K] extends object ? NestedValue<T[K], V, C> : never;
};
export type Leaf = Date | RegExp | Function | readonly unknown[];
export type WithId<T> = T & {
    _id?: string;
};
/**
 * Plain fields of `T`: keys and nested partials.
 * `$` operators are added on top of it by the query types.
 */
export type FieldsOf<T> = {
    [K in keyof T]?: T[K] extends Leaf ? T[K] : T[K] extends object ? FieldsOf<T[K]> | T[K] : T[K];
};
/** Helper type for nested path structure */
export type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
