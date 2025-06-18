import type { Context } from "hono";

export const getBody = async <T>(c: Context) => {
	try {
		return (await c.req.json()) as T;
	} catch {
		return null;
	}
};
