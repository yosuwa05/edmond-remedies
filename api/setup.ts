import { baseRouter } from "@/controllers";
import cors from "@elysiajs/cors";
import { logger } from "@rasla/logify";
import { Elysia } from "elysia";
import { connect } from "mongoose";

const app = new Elysia();

app.use(cors());

try {
  await connect(process.env.DB_URL as string, {
    dbName: "edmond-remedies",
  });
  console.log("Connected to MongoDB");
} catch (e) {
  console.log(e);
}

// app.use(
//   swagger({
//     path: "/api/docs",
//     exclude: ["/docs", "/docs/json"],
//     theme: "dark",
//     documentation: {
//       servers: [
//         {
//           url: "/",
//         },
//       ],
//       info: {
//         title: "EdmondRemedies",
//         version: "1.0.0",
//       },
//       components: {
//         securitySchemes: {
//           bearerAuth: {
//             scheme: "bearer",
//             type: "http",
//             bearerFormat: "JWT",
//           },
//         },
//       },
//     },
//   })
// );

// @ts-ignore
app.use(logger({ console: true, skip: ["/docs", "/docs/json"] }));

app.use(baseRouter);

app.onError(({ code, error, set }) => {
  set.status = "Internal Server Error";
  return {
    message: error,
    ok: false,
  };
});

export { app };
