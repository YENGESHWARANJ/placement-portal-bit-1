import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model("User", userSchema);

const checkCounts = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/placement_portal";
        await mongoose.connect(uri);
        const count = await User.countDocuments({});
        console.log("Total User Count:", count);
        const emails = await User.find({}).distinct("email");
        console.log("Emails in DB:", JSON.stringify(emails, null, 2));
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
};

checkCounts();
