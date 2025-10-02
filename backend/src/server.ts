import "dotenv/config";
import express from "express";
import { routes } from "./routes";
import { connectDB } from "./lib/mongo";

const app = express();

app.use(routes);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log("Server is running");
  connectDB();
});
