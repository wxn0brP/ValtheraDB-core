import { MemoryAdapter } from "../src/adapters/memoryAdapter.js";

export default async () => {
    const adapter = new MemoryAdapter();
    await adapter.init();
    adapter._inited = true;
    return adapter;
}
