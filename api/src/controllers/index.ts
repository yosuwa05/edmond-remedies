// import { PasetoUtil } from "@/lib/paseto";
// @ts-ignore
import Elysia, { t } from "elysia";
import { adminController } from "./admin";
import { userBaseController } from "./user";

const baseRouter = new Elysia({
  prefix: "/api",
});

baseRouter.use(adminController);
baseRouter.use(userBaseController);

export { baseRouter };

