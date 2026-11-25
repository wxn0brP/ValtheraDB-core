export interface TypeConfig {
}
export type IsStrict = TypeConfig extends {
    strict: false;
} ? false : true;
