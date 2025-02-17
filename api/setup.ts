// import { ProductCategory } from "@/models/product-category";
import { baseRouter } from "@/controllers";
import cors from "@elysiajs/cors";
// import { cron } from "@elysiajs/cron";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@rasla/logify";
// import dayjs from "dayjs";
import { Elysia } from "elysia";
import { connect } from "mongoose";
// import { broadcastMessage } from "@/lib/ws-store";
// import { Product } from "@/models/product";

const app = new Elysia();

app.use(cors());

try {
  await connect(process.env.DB_URL as string, {
    dbName: "EdmondRemedies",
  });
  console.log("Connected to MongoDB");
} catch (e) {
  console.log(e);
}

swagger
app.use(
  swagger({
    path: "/api/docs",
    exclude: ["/docs", "/docs/json"],
    theme: "dark",
    documentation: {
      servers: [
        {
          url: "/",
        },
      ],
      info: {
        title: "EdmondRemedies",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            scheme: "bearer",
            type: "http",
            bearerFormat: "JWT",
          },
        },
      },
    },
  })
);

// @ts-ignore
app.use(logger({ console: true, skip: ["/docs", "/docs/json"] }));

app.use(baseRouter);

// app.use(
//   cron({
//     name: "heartbeat",
//     pattern: "*/1 * * * *",
//     async run() {
//       const now = dayjs().toDate();

//       await ProductCategory.updateMany(
//         { reEnabledAt: { $lte: now } },
//         { $set: { reEnabledAt: null, active: true } }
//       );
//       await Product.updateMany(
//         { reEnabledAt: { $lte: now } },
//         { $set: { reEnabledAt: null, active: true } }
//       );
//     },
//   })
// );

app.onError(({ code, error, set }) => {
  set.status = "Internal Server Error";
  return {
    message: error,
    ok: false,
  };
});

// setInterval(() => {
//   broadcastMessage("New Order Received");
// }, 2000);

export { app };
