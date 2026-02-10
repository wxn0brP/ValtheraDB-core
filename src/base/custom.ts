import { CustomFileCpu } from "../customFileCpu";
import { addId } from "../helpers/addId";
import { Data } from "../types/data";
import { VQuery } from "../types/query";
import { findUtil } from "../utils/action";
import { ActionsBase } from "./actions";

export class CustomActionsBase extends ActionsBase {
    fileCpu: CustomFileCpu;

    constructor() {
        super();
    }

    /**
     * Add a new entry to the specified database.
     */
    async add(query: VQuery) {
        await this.ensureCollection(query);
        await addId(query, this);
        const { collection, data } = query;
        await this.fileCpu.add(collection, data);
        return data;
    }

    /**
     * Find entries in the specified database based on search criteria.
     */
    async find(query: VQuery) {
        await this.ensureCollection(query);
        const data = await findUtil(query, this.fileCpu, [query.collection]);
        return data;
    }

    /**
     * Find the first matching entry in the specified database based on search criteria.
     */
    async findOne({ collection, search, context = {}, findOpts = {} }: VQuery) {
        await this.ensureCollection(arguments[0]);
        let data = await this.fileCpu.findOne(collection, search, context, findOpts) as Data;
        return data || null;
    }

    /**
     * Update entries in the specified database based on search criteria and an updater function or object.
     */
    async update({ collection, search, updater, context = {} }: VQuery) {
        await this.ensureCollection(arguments[0]);
        return await this.fileCpu.update(collection, false, search, updater, context);
    }

    /**
     * Update the first matching entry in the specified database based on search criteria and an updater function or object.
     */
    async updateOne({ collection, search, updater, context = {} }: VQuery) {
        await this.ensureCollection(arguments[0]);
        const res = await this.fileCpu.update(collection, true, search, updater, context);
        return res.length ? res[0] : null;
    }

    /**
     * Remove entries from the specified database based on search criteria.
     */
    async remove({ collection, search, context = {} }: VQuery) {
        await this.ensureCollection(arguments[0]);
        return await this.fileCpu.remove(collection, false, search, context);
    }

    /**
     * Remove the first matching entry from the specified database based on search criteria.
     */
    async removeOne({ collection, search, context = {} }: VQuery) {
        await this.ensureCollection(arguments[0]);
        const res = await this.fileCpu.remove(collection, true, search, context);
        return res.length ? res[0] : null;
    }
}