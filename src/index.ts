import { Hono } from "hono";
import { serveStatic } from "hono/bun";

import routes from "./routes";

const app = new Hono();

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
		401: "Unauthenticatated",
		500: err.message || "Something went wrong",
	};
	const status = err?.res?.status || 500;
	const message = messages[status];
	return c.json({ error: { message } }, status);
});

export default app;
