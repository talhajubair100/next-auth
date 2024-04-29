import mongoose from "mongoose";

export async function connectDB() {
    try {
        mongoose.connect(process.env.MONGO_URL);
        const connection = await mongoose.connection;
        console.log("Connected to database", connection.name);
        connection.on('connected', () => {
            console.log("Mongoose connected to db");
        })
        connection.on('error', (err) => {
            console.log("Mongoose connection error", err);
            process.exit(1);
        })
    } catch (e) {
        console.error("Error connecting", e);
    }
}