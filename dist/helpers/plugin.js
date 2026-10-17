import { getOpKind } from "../utils/opKind.js";
export function rewriteOp(ctx, op, query) {
    ctx.op = op;
    if (query !== undefined)
        ctx.query = query;
    ctx.kind = getOpKind(op);
    const q = ctx.query;
    ctx.collection = typeof q === "string" ? q : q?.collection;
}
