import express, { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
const app: Application = express();
import CookieParser from "cookie-parser";
import { connectDb } from "./config/db.config.js";
import AuthRoutes from "./routes/user.route.js"
const PORT = process.env.PORT || 7000;

// * Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(CookieParser());
app.use("/api/v1/auth", AuthRoutes);

connectDb();


app.get("/", (req: Request, res: Response) => {
  return res.send("It's working 🙌");

});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
