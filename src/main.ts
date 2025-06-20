import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { HTTPException } from "hono/http-exception";
import { LinearRouter } from "hono/router/linear-router";

import routes from "./routes";

const app = new Hono({
	router: new LinearRouter(),
});

app.use(
	"/static/*",
	serveStatic({
		root: "./",
		precompressed: true,
	}),
);

app.route("/", routes);

app.notFound((c) => {
	return c.json(
		{
			error: {
				message: "Not found",
			},
		},
		404,
	);
});

app.onError((err, c) => {
	const messages: Record<number, string> = {
		401: "Unauthenticaticated",
		500: err.message || "Something went wrong",
	};
	const status = err instanceof HTTPException ? err.status : 500;
	const message = messages[status];
	return c.json({ error: { message } }, status);
});

export default app;
