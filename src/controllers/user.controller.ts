import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { type User, usersTable } from "@/database/schema/user.schema";
import { factory } from "@/factory";
import { logMiddleware } from "@/middlewares/log.middleware";
import type { UserRequest } from "@/types/requests/user.request";
import { getBody } from "@/utils/req.util";

export const userController = {
	index() {
		return factory.createHandlers(logMiddleware, async (c) => {
			let users = await c.var.redis.get<User[]>("users");
			if (users) {
				return c.json({ data: users });
			}
			users = await c.var.db.select().from(usersTable);
			await c.var.redis.set("users", users);
			return c.json({ data: users });
		});
	},

	show() {
		return factory.createHandlers(logMiddleware, async (c) => {
			const idParam = c.req.param("id");
			const id = Number(idParam);
			const user = await c.var.db
				.select()
				.from(usersTable)
				.where(eq(usersTable.id, id));

			if (user.length === 0) {
				return c.notFound();
			}

			return c.json({ data: user });
		});
	},

	create() {
		return factory.createHandlers(logMiddleware, async (c) => {
			const body = await getBody<UserRequest>(c);
			if (!body) {
				throw new HTTPException(403);
			}

			const result = await c.var.db
				.insert(usersTable)
				.values({
					age: body.age,
					email: body.email,
					name: body.name,
				})
				.returning();

			return c.json(
				{
					data: result[0],
					success: true,
				},
				201,
			);
		});
	},

	update() {
		return factory.createHandlers(logMiddleware, async (c) => {
			const idParam = c.req.param("id");
			const id = Number(idParam);
			const body = await getBody<UserRequest>(c);
			if (!body) {
				throw new HTTPException(403);
			}

			const userResult = await c.var.db
				.select()
				.from(usersTable)
				.where(eq(usersTable.id, id));

			if (userResult.length !== 1) {
				return c.notFound();
			}
			const user = userResult[0];

			const result = await c.var.db
				.update(usersTable)
				.set({
					name: body.name || user.name,
					age: body.age || user.age,
					email: body.email || user.email,
				})
				.where(eq(usersTable.id, user.id))
				.returning();

			return c.json({ data: result[0] });
		});
	},

	delete() {
		return factory.createHandlers(logMiddleware, async (c) => {
			const idParam = c.req.param("id");
			const id = Number(idParam);

			await c.var.db.delete(usersTable).where(eq(usersTable.id, id));

			return c.json({ success: true }, 203);
		});
	},
};
