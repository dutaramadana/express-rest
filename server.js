import express from "express";
import dotenv from "dotenv";
import userRouter from "./routers/userRouter.js";
import postRouter from "./routers/postRouter.js";
import otpRouter from "./routers/otpRouter.js";
import { notFound } from "./middlewares/errorMiddleware.js";

const app = express();
app.use(express.json());

dotenv.config();

const PORT = process.env.SERVER_PORT || 5000;

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api", otpRouter);

app.use(notFound);

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
