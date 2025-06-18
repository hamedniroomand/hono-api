import { Hono } from "hono";
import api from "./api";
import web from "./web";

const app = new Hono();

app.route("/", web);
app.route("/api", api);

export default app;
