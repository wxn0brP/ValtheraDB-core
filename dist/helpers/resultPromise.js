export class ResultPromise extends Promise {
    _type;
    _data;
    get type() {
        this._type ??= this.then(res => res.type);
        return this._type;
    }
    get data() {
        this._data ??= this.then(res => res.data);
        return this._data;
    }
    static get [Symbol.species]() {
        return Promise;
    }
    static wrap(promise) {
        return new ResultPromise(resolve => resolve(promise));
    }
}
