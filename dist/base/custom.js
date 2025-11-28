import { addId } from "../helpers/addId.js";
import { findUtil } from "../utils/action.js";
import ActionsBase from "./actions.js";
export class CustomActionsBase extends ActionsBase {
    fileCpu;
    constructor() {
        super();
    }
    /**
     * Add a new entry to the specified database.
     */
    async add(query) {
        await this.ensureCollection(query);
        await addId(query, this);
        const { collection, data } = query;
        await this.fileCpu.add(collection, data);
        return data;
    }
    /**
     * Find entries in the specified database based on search criteria.
     */
    async find(query) {
        await this.ensureCollection(query);
        const data = await findUtil(query, this.fileCpu, [query.collection]);
        return data;
    }
    /**
     * Find the first matching entry in the specified database based on search criteria.
     */
    async findOne({ collection, search, context = {}, findOpts = {} }) {
        await this.ensureCollection(arguments[0]);
        let data = await this.fileCpu.findOne(collection, search, context, findOpts);
        return data || null;
    }
    /**
     * Update entries in the specified database based on search criteria and an updater function or object.
     */
    async update({ collection, search, updater, context = {} }) {
        await this.ensureCollection(arguments[0]);
        return await this.fileCpu.update(collection, false, search, updater, context);
    }
    /**
     * Update the first matching entry in the specified database based on search criteria and an updater function or object.
     */
    async updateOne({ collection, search, updater, context = {} }) {
        await this.ensureCollection(arguments[0]);
        return await this.fileCpu.update(collection, true, search, updater, context);
    }
    /**
     * Remove entries from the specified database based on search criteria.
     */
    async remove({ collection, search, context = {} }) {
        await this.ensureCollection(arguments[0]);
        return await this.fileCpu.remove(collection, false, search, context);
    }
    /**
     * Remove the first matching entry from the specified database based on search criteria.
     */
    async removeOne({ collection, search, context = {} }) {
        await this.ensureCollection(arguments[0]);
        return await this.fileCpu.remove(collection, true, search, context);
    }
}
