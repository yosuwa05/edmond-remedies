import Elysia from "elysia";
import { authController } from "./adminAuth-controller";
import { PasetoUtil } from "@/lib/paseto";
import { EnquiryFormController } from "./enquiryForm-controller";


const adminController = new Elysia({
  prefix: "/admin",
})
  .use(authController)
  .onBeforeHandle(async ({ cookie, set }) => {
    let pasetoToken = cookie.admin!.value ?? "";

    if (!pasetoToken) {
      set.status = 401;
      return {
        message: "Unauthorized",
      };
    }

    if (!pasetoToken.startsWith("v4.local.")) {
      set.status = 401;
      return {
        message: "Unauthorized",
      };
    }

    const payload = await PasetoUtil.decodePaseto(pasetoToken, true);

    if (!payload) {
      set.status = 401;
      return {
        message: "Unauthorized",
      };
    }
  })
  .use(EnquiryFormController)


export { adminController };
