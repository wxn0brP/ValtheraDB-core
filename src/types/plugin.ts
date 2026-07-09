import type { ValtheraClass } from "../db/valthera";

export interface ValtheraPlugin {
    name: string;
    execute(op: string, query: any, next: (q?: any) => Promise<any>): Promise<any>;
    init?: (db: ValtheraClass) => void;
}
