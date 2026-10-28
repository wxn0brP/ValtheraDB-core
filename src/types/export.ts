export namespace ValtheraTypes {
	export type Arg = import("./arg").Arg;
	export type Search = import("./arg").Search;
	export type Updater = import("./arg").Updater;
	export type DbFindOpts = import("./options").DbFindOpts;
	export type FindOpts = import("./options").FindOpts;
	export type DbOpts = import("./options").DbOpts;
	export type AdapterOpts = import("./options").AdapterOpts;
	export type AdapterCapabilities = import("./action").AdapterCapabilities;
	export type Data = import("./data").Data;
	export type SearchOptions = import("./searchOpts").SearchOptions;
	export type Id = import("./Id").Id;
	/** @deprecated */
	export type Context = import("./types").VContext;
	/** @deprecated */
	export type VContext = import("./types").VContext;
}
