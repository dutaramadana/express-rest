import express from "express";
import dotenv from "dotenv";
import userRouter from "./routers/userRouter.js";

const app = express();
app.use(express.json());

dotenv.config();

const PORT = process.env.SERVER_PORT || 5000;

app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
