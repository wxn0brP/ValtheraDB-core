export type KeysMatching<T, V, C = V> = {
    [K in keyof T]-?: T[K] extends C ? K : never;
}[keyof T];
export type PartialOfType<T, V, C = V> = Partial<Record<KeysMatching<T, V, C>, V>>;
export type PartialPickMatching<T, V, C = V> = Partial<Pick<T, KeysMatching<T, V, C>>>;
export type NestedValue<T, V, C = V> = {
    [K in keyof T as T[K] extends C ? K : T[K] extends object ? K : never]?: T[K] extends C ? V : T[K] extends object ? NestedValue<T[K], V, C> : never;
};
export type Leaf = Date | RegExp | Function | readonly unknown[];
export type WithId<T> = T & {
    _id?: string;
};
export type FieldsOf<T> = {
    [K in keyof T]?: T[K] extends Leaf ? T[K] : T[K] extends object ? FieldsOf<T[K]> | T[K] : T[K];
};
export type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
