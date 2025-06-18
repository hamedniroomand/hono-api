import type { Context } from "hono";

export const userController = {
	getUsers: async (c: Context) => {
		return c.json({
			data: [],
		});
	},
};
