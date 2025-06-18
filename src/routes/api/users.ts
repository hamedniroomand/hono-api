import { userController } from "@/controllers/user.controller";
import { factory } from "@/factory";

const app = factory.createApp();

app.get("/", ...userController.index());
app.post("/", ...userController.create());
app.get("/:id", ...userController.show());
app.put("/:id", ...userController.update());
// app.delete(":/id", ...userController.delete());

export default app;
