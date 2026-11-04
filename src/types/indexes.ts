/**
 * Index options - adapter-dependent, should not be relied upon
 */
export interface IndexOpts {
	unique?: boolean;
	name?: string;
}

export interface IndexDefinition {
	collection: string;
	fields: string[];
	opts?: IndexOpts;
}
