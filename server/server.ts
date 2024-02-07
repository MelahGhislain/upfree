import { app } from "./app";
import dotenv from "dotenv";
import { connectDb } from "./utils/db";
import { env } from "./utils/methods";

dotenv.config();

const port  = env('PORT') ?? 5000

// Create a server
app.listen(port, () => {
    console.log(`Running on port ${port}`);
    connectDb();
})