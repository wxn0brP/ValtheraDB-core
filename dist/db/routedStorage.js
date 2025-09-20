import ActionsBase from "../base/actions.js";
export class RoutedStorage extends ActionsBase {
    rules;
    defaultBackend;
    constructor(rules, defaultBackend) {
        super();
        this.rules = rules;
        this.defaultBackend = Array.isArray(defaultBackend) ? defaultBackend : [defaultBackend];
    }
    _matchBackends(config) {
        const matched = [];
        const { collection } = config;
        for (const rule of this.rules) {
            const { match, backends } = rule;
            if ((typeof match === "string" && (match === collection) || match === "*") ||
                (match instanceof RegExp && match.test(collection)) ||
                (typeof match === "function" && match(config))) {
                matched.push(...backends);
            }
        }
        if (matched.length === 0)
            matched.push(...this.defaultBackend);
        return matched;
    }
    async _withAll(config, fn, gather = false) {
        const backends = this._matchBackends(config);
        if (gather) {
            return await Promise.all(backends.map(fn)).then(res => res[0]);
        }
        else {
            for (const b of backends)
                await fn(b);
            return undefined;
        }
    }
    async _withFirst(config, fn) {
        const [first] = this._matchBackends(config);
        return await fn(first);
    }
    async init(...args) {
        const all = new Set(this.rules.flatMap(r => r.backends));
        await Promise.all(Array.from(all).map(b => b.init?.(...args)));
    }
    async add(config) {
        const res = await this._withFirst(config, b => b.add(config));
        await this._withAll({ ...config, data: res }, b => b.add({ ...config, data: res }));
        return res;
    }
    async find(config) {
        return this._withFirst(config, b => b.find(config));
    }
    async findOne(config) {
        return this._withFirst(config, b => b.findOne(config));
    }
    async update(config) {
        return this._withAll(config, b => b.update(config), true);
    }
    async updateOne(config) {
        return this._withAll(config, b => b.updateOne(config), true);
    }
    async remove(config) {
        return this._withAll(config, b => b.remove(config), true);
    }
    async removeOne(config) {
        return this._withAll(config, b => b.removeOne(config), true);
    }
    async ensureCollection(config) {
        return this._withAll(config, b => b.ensureCollection(config), true);
    }
    async issetCollection(config) {
        return this._withFirst(config, b => b.issetCollection(config));
    }
    async removeCollection(config) {
        return this._withAll(config, b => b.removeCollection(config), true);
    }
    async getCollections() {
        const all = await Promise.all(Array.from(new Set(this.rules.flatMap(r => r.backends)))
            .map(b => b.getCollections()));
        const merged = new Set(all.flat());
        return Array.from(merged);
    }
}
