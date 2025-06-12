import dotenv from "dotenv"
dotenv.config()

import express from "express";
import cors from "cors";
import UserRoutes from "./src/routes/UserRoutes";
import { connectDB } from "./src/database/db";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", UserRoutes);

connectDB()
const port = 5000;
app.listen(port, () => console.log(`Sevidor local na porta: ${port}`));

app.get("/", (req, res) => {
    res.send("API iniciada com sucesso! Mais informações: rodrigour@gmail.com");
});
