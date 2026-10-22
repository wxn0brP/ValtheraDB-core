import type { ValtheraClass } from "../db/valthera";
import type { PluginOpKind } from "../utils/opKind";
export interface PluginContext {
    op: string;
    kind: PluginOpKind;
    collection?: string;
    query: any;
    next: () => Promise<any>;
    setOp(op: string, query?: any): void;
    setQuery(query: any): void;
}
export interface ValtheraPlugin {
    name: string;
    execute(ctx: PluginContext): Promise<any>;
    init?: (db: ValtheraClass) => void;
    collections?: string[];
}
