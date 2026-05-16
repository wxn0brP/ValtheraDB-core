import { addId } from "../helpers/addId.js";
import { findUtil } from "../utils/action.js";
import { ActionsBase } from "./actions.js";
export class CustomActionsBase extends ActionsBase {
    fileCpu;
    constructor() {
        super();
    }
    /**
     * Add a new entry to the specified database.
     */
    async add(query) {
        await this.ensureCollection(query.collection);
        await addId(query, this);
        const { collection, data } = query;
        await this.fileCpu.add(collection, query);
        return data;
    }
    /**
     * Find entries in the specified database based on search criteria.
     */
    async find(query) {
        await this.ensureCollection(query.collection);
        const data = await findUtil(query, this.fileCpu, [query.collection]);
        return data;
    }
    /**
     * Find the first matching entry in the specified database based on search criteria.
     */
    async findOne(query) {
        await this.ensureCollection(query.collection);
        let data = await this.fileCpu.findOne(query.collection, query);
        return data || null;
    }
    /**
     * Update entries in the specified database based on search criteria and an updater function or object.
     */
    async update(query) {
        await this.ensureCollection(query.collection);
        return await this.fileCpu.update(query.collection, query, false);
    }
    /**
     * Update the first matching entry in the specified database based on search criteria and an updater function or object.
     */
    async updateOne(query) {
        await this.ensureCollection(query.collection);
        const res = await this.fileCpu.update(query.collection, query, true);
        return res.length ? res[0] : null;
    }
    /**
     * Remove entries from the specified database based on search criteria.
     */
    async remove(query) {
        await this.ensureCollection(query.collection);
        return await this.fileCpu.remove(query.collection, query, false);
    }
    /**
     * Remove the first matching entry from the specified database based on search criteria.
     */
    async removeOne(query) {
        await this.ensureCollection(query.collection);
        const res = await this.fileCpu.remove(query.collection, query, true);
        return res.length ? res[0] : null;
    }
}
