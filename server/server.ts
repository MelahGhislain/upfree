import { app } from "./src/app";
import dotenv from "dotenv";
import { connectDb } from "./src/utils/db";
import { env } from "./src/utils/methods";

dotenv.config();

const port  = env('PORT') ?? 5000

// Create a server
app.listen(port, () => {
    console.log(`Running on port ${port}`);
    connectDb();
})