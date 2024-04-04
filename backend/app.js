import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cors from "cors";
import cookieParser from "cookie-parser"
dotenv.config();
import path from "path";

const app = express();


const corsConfig = {
    credentials: true,
    origin: true,
};

const __dirname = path.resolve();

const port = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(cors(corsConfig));
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  res.status(500).send({
    success: false,
    message: err.message || "Something went wrong",
    status: err.status || 500,
  });
});

