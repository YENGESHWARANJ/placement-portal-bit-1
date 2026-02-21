import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "./src/modules/users/user.model";

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        const users = await User.find({}, { password: 0 });
        console.log("Found Users in DB:", JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (err) {
        console.error("Error checking users:", err);
        process.exit(1);
    }
}

checkUsers();
