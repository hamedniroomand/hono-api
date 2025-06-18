import { Hono } from "hono";
import { userController } from "../../controllers/user.controller";
import { factory } from "../../factory";
import { logMiddleware } from "../../middlewares/log.middleware";

const app = new Hono();

const getUsers = factory.createHandlers(logMiddleware, userController.getUsers);

app.get("/", ...getUsers);

export default app;
