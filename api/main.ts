import { Admin } from "@/model/admin/admin-model";
import { app } from "./setup";

const PORT = process.env.PORT || 4000;

const admin = new Admin({
  active: true,
  email: "admin@doctorpro.in",
  password: "admin",
  role: "admin",
});

await admin.save();

app.listen(
  {
    port: PORT,
  },
  ({ port }) => {
    console.log(`Listening on http://${app.server?.hostname}:${port}`);
    console.log(
      `Checkout the docs at http://${app.server?.hostname}:${port}/api/docs`
    );
  }
);
