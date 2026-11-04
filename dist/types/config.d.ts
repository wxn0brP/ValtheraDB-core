export interface TypeConfig {
}
export type IsStrict = TypeConfig extends {
    strict: false;
} ? false : TypeConfig extends {
    strict: true;
} ? true : false;
