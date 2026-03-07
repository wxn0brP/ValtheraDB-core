import { CustomFileCpu } from "../customFileCpu";
import { addId } from "../helpers/addId";
import { Data } from "../types/data";
import * as Query from "../types/query";
import { findUtil } from "../utils/action";
import { ActionsBase } from "./actions";

export abstract class CustomActionsBase extends ActionsBase {
    fileCpu: CustomFileCpu;

    constructor() {
        super();
    }

    /**
     * Add a new entry to the specified database.
     */
    async add(query: Query.AddQuery) {
        await this.ensureCollection(query.collection);
        await addId(query, this);
        const { collection, data } = query;
        await this.fileCpu.add({ collection, data });
        return data;
    }

    /**
     * Find entries in the specified database based on search criteria.
     */
    async find(query: Query.FindQuery) {
        await this.ensureCollection(query.collection);
        const data = await findUtil(query, this.fileCpu, [query.collection]);
        return data;
    }

    /**
     * Find the first matching entry in the specified database based on search criteria.
     */
    async findOne(query: Query.FindOneQuery) {
        await this.ensureCollection(query.collection);
        let data = await this.fileCpu.findOne(query) as Data;
        return data || null;
    }

    /**
     * Update entries in the specified database based on search criteria and an updater function or object.
     */
    async update(query: Query.UpdateQuery) {
        await this.ensureCollection(query.collection);
        return await this.fileCpu.update(query, false);
    }

    /**
     * Update the first matching entry in the specified database based on search criteria and an updater function or object.
     */
    async updateOne(query: Query.UpdateQuery) {
        await this.ensureCollection(query.collection);
        const res = await this.fileCpu.update(query, true);
        return res.length ? res[0] : null;
    }

    /**
     * Remove entries from the specified database based on search criteria.
     */
    async remove(query: Query.RemoveQuery) {
        await this.ensureCollection(query.collection);
        return await this.fileCpu.remove(query, false);
    }

    /**
     * Remove the first matching entry from the specified database based on search criteria.
     */
    async removeOne(query: Query.RemoveQuery) {
        await this.ensureCollection(query.collection);
        const res = await this.fileCpu.remove(query, true);
        return res.length ? res[0] : null;
    }
}
