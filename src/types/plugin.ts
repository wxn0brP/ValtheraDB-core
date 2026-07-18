import type { ValtheraClass } from "../db/valthera";

export interface PluginContext {
	op: string;
	query: any;
	next: () => Promise<any>;
}

export interface ValtheraPlugin {
	name: string;
	execute(ctx: PluginContext): Promise<any>;
	init?: (db: ValtheraClass) => void;
}
