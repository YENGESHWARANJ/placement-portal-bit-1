import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model("User", userSchema);

const checkUsers = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/placement_portal";
        await mongoose.connect(uri);
        const users = await User.find({}).select("name email role status");
        console.log("All Users in DB:", JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUsers();
