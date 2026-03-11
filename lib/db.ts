import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!

if(!MONGODB_URI){
    throw new Error("Connection string not defined!")
}

let cached = global.mongoose

if(!cached){
    cached = global.mongoose = {connection: null, promise: null}
}

export async function connectToDb(){
    if(cached.connection){
        return cached.connection
    }

    if(!cached.promise){
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10
        }

        cached.promise = (async () => {
            await mongoose.connect(MONGODB_URI, opts)
            return mongoose.connection
        })()
        
    }

    try {
        cached.connection = await cached.promise
    } catch (error) {
        console.log("Cannot connect to MongoDB")
    }

    return cached.connection


}