export interface IndexOpts {
    unique?: boolean;
    name?: string;
}
export interface IndexDefinition {
    collection: string;
    fields: string[];
    opts?: IndexOpts;
}
