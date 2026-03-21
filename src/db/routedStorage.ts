import { ActionsBase } from "../base/actions";
import { VQueryT, VQuery } from "../types/query";

export type MatchRule = string | RegExp | ((config: VQuery) => boolean);

export interface RouteEntry {
    match: MatchRule;
    backends: ActionsBase[];
}

export class RoutedStorage extends ActionsBase {
    rules: RouteEntry[];
    defaultBackend: ActionsBase[];

    constructor(rules: RouteEntry[], defaultBackend: ActionsBase | ActionsBase[]) {
        super();
        this.rules = rules;
        this.defaultBackend = Array.isArray(defaultBackend) ? defaultBackend : [defaultBackend];
    }

    _matchBackends(config: VQuery): ActionsBase[] {
        const matched: ActionsBase[] = [];
        const { collection } = config;

        for (const rule of this.rules) {
            const { match, backends } = rule;
            if (
                (typeof match === "string" && (match === collection) || match === "*") ||
                (match instanceof RegExp && match.test(collection)) ||
                (typeof match === "function" && match(config))
            ) {
                matched.push(...backends);
            }
        }

        if (matched.length === 0) matched.push(...this.defaultBackend);

        return matched;
    }

    async _withAll<T>(config: VQuery | string, fn: (b: ActionsBase) => Promise<T>, gather = false): Promise<T> {
        const backends = this._matchBackends(config);
        if (gather) {
            return await Promise.all(backends.map(fn)).then(res => res[0]);
        } else {
            for (const b of backends) await fn(b);
            return undefined as unknown as T;
        }
    }

    async _withFirst<T>(config: VQuery | string, fn: (b: ActionsBase) => Promise<T>): Promise<T> {
        const [first] = this._matchBackends(config);
        return await fn(first);
    }

    async init(...args: any[]) {
        const all = new Set(this.rules.flatMap(r => r.backends));
        await Promise.all(Array.from(all).map(b => b.init?.(...args)));
    }

    async add(config: VQueryT.Add) {
        const res = await this._withFirst(config, b => b.add(config));
        await this._withAll({ ...config, data: res }, b => b.add({ ...config, data: res }));
        return res;
    }

    async find(config: VQueryT.Find) {
        return this._withFirst(config, b => b.find(config));
    }

    async findOne(config: VQueryT.FindOne) {
        return this._withFirst(config, b => b.findOne(config));
    }

    async update(config: VQueryT.Update) {
        return this._withAll(config, b => b.update(config), true);
    }

    async updateOne(config: VQueryT.Update) {
        return this._withAll(config, b => b.updateOne(config), true);
    }

    async remove(config: VQueryT.Remove) {
        return this._withAll(config, b => b.remove(config), true);
    }

    async removeOne(config: VQueryT.Remove) {
        return this._withAll(config, b => b.removeOne(config), true);
    }

    async ensureCollection(collection: string) {
        return this._withAll(collection, b => b.ensureCollection(collection), true);
    }

    async issetCollection(collection: string) {
        return this._withFirst(collection, b => b.issetCollection(collection));
    }

    async removeCollection(collection: string) {
        return this._withAll(collection, b => b.removeCollection(collection), true);
    }

    async getCollections() {
        const all = await Promise.all(
            Array.from(new Set(this.rules.flatMap(r => r.backends)))
                .map(b => b.getCollections())
        );
        const merged = new Set(all.flat());
        return Array.from(merged);
    }
}
