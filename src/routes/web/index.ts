import { factory } from "@/factory";

const app = factory.createApp();

app.get("/", (c) => c.html(`<h1>Hello World</h1>`));

export default app;
