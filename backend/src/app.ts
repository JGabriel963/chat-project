import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { routes } from "./routes";
import { errorHandling } from "./middlewares/error-handling";

const app = express();

app.use(express.json());
app.use(cors());

app.use(cookieParser());

app.use(routes);

app.use(errorHandling);

export { app };
