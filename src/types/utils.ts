export type KeysMatching<T, V, C = V> = {
    [K in keyof T]-?: T[K] extends C ? K : never;
}[keyof T];
export type PartialOfType<T, V, C=V> = Partial<Record<KeysMatching<T, V, C>, V>>;
export type PartialPickMatching<T, V, C=V> = Partial<Pick<T, KeysMatching<T, V, C>>>;