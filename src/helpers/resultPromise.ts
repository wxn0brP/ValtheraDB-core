export class ResultPromise<
	T extends {
		data: any;
		type: string;
	},
> extends Promise<T> {
	private _type?: Promise<T["type"]>;
	private _data?: Promise<T["data"]>;

	get type(): Promise<T["type"]> {
		this._type ??= this.then(res => res.type);
		return this._type;
	}

	get data(): Promise<T["data"]> {
		this._data ??= this.then(res => res.data);
		return this._data;
	}

	static get [Symbol.species]() {
		return Promise;
	}

	static wrap<
		S extends {
			data: any;
			type: string;
		},
	>(promise: Promise<S>): ResultPromise<S> {
		return new ResultPromise<S>(resolve => resolve(promise));
	}
}
