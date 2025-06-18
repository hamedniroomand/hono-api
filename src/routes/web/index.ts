import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.html(`<h1>Hello World</h1>`));

export default app;
