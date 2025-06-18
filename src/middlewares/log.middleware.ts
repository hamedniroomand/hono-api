import type { Context } from "hono";
import { factory } from "../factory";

export const logMiddleware = factory.createMiddleware((c: Context, next) => {
	console.log(`${c.req.method} ${c.req.url}`);
	return next();
});
