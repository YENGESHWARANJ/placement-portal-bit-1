import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const clearDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        console.log("URI Format:", process.env.MONGO_URI?.replace(/:([^:@]{8,})@/, ":***@")); // Hide password in log

        await mongoose.connect(process.env.MONGO_URI as string, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 10000
        });
        console.log("✅ Connected successfully. Clearing collections...");

        const usersResult = await mongoose.connection.collection("users").deleteMany({});
        console.log(`🗑️ Deleted ${usersResult.deletedCount} users.`);

        const studentsResult = await mongoose.connection.collection("students").deleteMany({});
        console.log(`🗑️ Deleted ${studentsResult.deletedCount} students.`);

        const logsResult = await mongoose.connection.collection("loginlogs").deleteMany({});
        console.log(`🗑️ Deleted ${logsResult.deletedCount} login logs.`);

        console.log("✅ Successfully cleared all authentication data.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error Database Operation:", error);
        process.exit(1);
    }
};

clearDB();
