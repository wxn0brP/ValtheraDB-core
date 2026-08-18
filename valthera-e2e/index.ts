import { MemoryAction } from "../src/db/memory.js";

export default async () => {
    const actions = new MemoryAction();
    await actions.init();
    actions._inited = true;
    return actions;
}
