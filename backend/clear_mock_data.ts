import mongoose from "mongoose";
import dotenv from "dotenv";

// Load backend env vars
dotenv.config({ path: "./src/config/.env" }); // or whichever path .env is

export const clearMockData = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://localhost:27017/placement_portal";
        await mongoose.connect(uri);
        console.log("Connected to MongoDB for data cleanup...");

        // Define keywords that indicate test/mock data
        const mockKeywords = ["Test", "Mock", "Dummy", "Example", "Demo", "asdf"];

        const mockRegex = new RegExp(mockKeywords.join("|"), "i");

        // 1. Delete Mock Jobs
        const jobResult = await mongoose.connection.collection("jobs").deleteMany({
            $or: [
                { title: { $regex: mockRegex } },
                { company: { $regex: mockRegex } }
            ]
        });
        console.log(`Deleted ${jobResult.deletedCount} mock jobs.`);

        // 2. Delete Mock Notices/Notifications
        const noticeResult = await mongoose.connection.collection("notices").deleteMany({
            $or: [
                { title: { $regex: mockRegex } },
                { content: { $regex: mockRegex } }
            ]
        });
        console.log(`Deleted ${noticeResult.deletedCount} mock notices.`);

        // 3. Delete Mock Messages (if a messages collection exists)
        try {
            const msgResult = await mongoose.connection.collection("messages").deleteMany({
                content: { $regex: mockRegex }
            });
            console.log(`Deleted ${msgResult.deletedCount} mock messages.`);
        } catch (e) {
            console.log("No messages collection found, skipping.");
        }


        // 4. Delete specific duplicates if requested - leaving this broad for now


        console.log("Cleanup complete.");
        process.exit(0);

    } catch (error) {
        console.error("Cleanup failed:", error);
        process.exit(1);
    }
}

clearMockData();
