import { createFactory } from "hono/factory";
import { db } from "@/database/db";
import { cacheService } from "@/services/cache.service";

export type AppEnv = {
	Variables: {
		db: typeof db;
		redis: typeof cacheService;
	};
};

export const factory = createFactory<AppEnv>({
	initApp: (app) => {
		app.use(async (c, next) => {
			c.set("db", db);
			c.set("redis", cacheService);
			await next();
		});
	},
});
