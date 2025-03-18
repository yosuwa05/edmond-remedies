import Elysia from "elysia";
import { EnquiryFormController } from "./enquiryForm-controller";

const userBaseController = new Elysia({
  prefix: "/user",
}).use(EnquiryFormController);



export { userBaseController };
