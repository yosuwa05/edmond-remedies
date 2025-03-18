import { PasetoUtil } from "@/lib/paseto";
import { Admin } from "../../model/admin/admin-model";
import Elysia, { t } from "elysia";

const authController = new Elysia({
  prefix: "/auth",
  tags: ["Admin Panel"],
})
  .post(
    "/create",
    async ({ body }) => {
      try {
        const { email, password } = body;

        const existing = await Admin.findOne({ email });

        if (existing) {
          return { message: "Email already exists" };
        }

        const admin = await Admin.create({
          email,
          password,
          role: "admin",
          active: true,
        });

        await admin.save();

        return {
          message: "Admin Created Successfully",
          data: {
            email: admin.email,
          },
        };
      } catch (error) {
        console.error(error);
        return {
          error,
        };
      }
    },
    {
      body: t.Object({
        email: t.String({
          format: "email",
          default: "admin@er.com",
        }),
        password: t.String({
          default: "admin",
        }),
      }),
      detail: {
        summary: "Create a new admin",
      },
    }
  )
  .post(
    "/login",
    async ({ body, set }) => {
      try {
        const { email, password } = body;

        let admin = await Admin.findOne({ email });

     if(admin?.password){
        if (await Bun.password.verify(password, admin.password)) {
            let token = await PasetoUtil.encodePaseto(
              {
                email: admin?.email,
                role: "admin",
              },
              true
            );
  
            set.status = 200;
            set.cookie = {
              admin: {
                value: token,
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/",
                maxAge: 1000 * 60 * 60 * 24,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
              },
            };
            return {
              message: "Login Successful",
              data: {
                email: admin?.email,
                token,
              },
              ok: true,
            };
          }
     }

        return { message: "Invalid Credentials" };
      } catch (error) {
        set.status = 400;
        console.error(error);
        return {
          error,
        };
      }
    },
    {
      detail: {
        summary: "Admin panel login",
      },
      body: t.Object({
        email: t.String({
          format: "email",
          default: "admin@kingschic.com",
        }),
        password: t.String({
          default: "admin",
        }),
      }),
    }
  )
  .post(
    "/logout",
    async ({ set }) => {
      set.status = 200;
      set.cookie = {
        admin: {
          value: "",
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
          expires: new Date(Date.now() - 1000 * 60 * 60 * 24), 
        },
      };
      return { message: "Logout Successful" };
    },
    {
      detail: {
        summary: "Admin panel logout",
      },
    }
  );

export { authController };
