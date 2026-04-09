require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]); 
import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db";
import playlistRoutes from "./routes/playlistRoutes";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import "./utils/cronJobs";


const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
connectDB();

app.use("/api/playlist", playlistRoutes);
app.use("/authAPI/auth", authRoutes);
app.use("/authAPI/admin", adminRoutes);

console.log(process.env.EMAIL);
console.log(process.env.EMAIL_PASS);


app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.get("/a", (req:Request, res:Response) =>{
    res.send("Tanmay");
})

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
