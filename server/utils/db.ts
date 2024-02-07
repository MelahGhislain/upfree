import mongoose from "mongoose";
import { env } from "./methods";

const dbUri = env('MONGO_URI') ?? ''

export const connectDb = async () => {
    try{
        await mongoose.connect(dbUri)
        .then((data) => {
            console.log(`Database connection established with ${data.connection.host}`)
        })
    }catch(err: any){
        console.error("Error while connecting database: ", err.message)
        // Try to connect database again after 5 seconds
        setTimeout(connectDb, 5000)
    }

}