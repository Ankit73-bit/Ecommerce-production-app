import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoute.js";
import AppError from "./helpers/appError.js";
import globalErrorHandler from "./controllers/errorController.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Config env
dotenv.config();

// Database config
connectDB();

// esmodule fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rest object
const app = express();

// middlewares
app.use(express.json());
app.use(morgan("dev"));

// join server
app.use(cors());

// app.use(cors())
app.use(express.static(path.join(__dirname, "./client/build")));

/// Rest API
// app.get("/", (req, res) => {
//   res.status(200).json({
//     message: "Hello from the server",
//   });
// });

// routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);

app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on server`, 404));
});

// Error handling middleWare
app.use(globalErrorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on ${process.env.DEV_MODE} mode on ${port}`);
});
