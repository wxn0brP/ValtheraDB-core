import { PluginContext } from "../types/plugin";
import { getOpKind } from "../utils/opKind";

export function rewriteOp(ctx: PluginContext, op: string, query?: any) {
	ctx.op = op;
	if (query !== undefined) ctx.query = query;
	ctx.kind = getOpKind(op);
	const q = ctx.query;
	ctx.collection = typeof q === "string" ? q : q?.collection;
}
