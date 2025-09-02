import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        mongoose.connection.on('connected',()=>{
            console.log("DB connected");
        })

        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI is not defined');
        }

        // Use dbName option instead of string concatenation to avoid malformed URLs
        const dbName = process.env.MONGODB_DB || 'e-commerce';
        await mongoose.connect(uri, { dbName });
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err?.message || err);
        throw err;
    }
}

export default connectDB;