export interface ValtheraPlugin {
    name: string;
    execute(op: string, query: any, next: (q?: any) => Promise<any>): Promise<any>;
}
