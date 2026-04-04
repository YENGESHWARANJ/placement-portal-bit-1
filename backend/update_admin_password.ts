import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// Simple schema to bypass imports pathing issues
const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model("User", userSchema);

const updatePassword = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/placement_portal";
        await mongoose.connect(uri);
        console.log("Connected to DB...");

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash("admin12345@", salt);

        const result = await User.findOneAndUpdate(
            { email: "admin@bitsathy.ac.in" },
            { 
               $set: {
                   password: hashedPassword, 
                   failedLoginAttempts: 0,
                   accountLockedUntil: null 
               }
            },
            { new: true }
        );

        if (result) {
            console.log("✅ Admin password updated successfully to 'admin12345@'");
        } else {
            console.log("Admin user not found. Creating one...");
            await User.create({
                name: "System Admin",
                email: "admin@bitsathy.ac.in",
                password: hashedPassword,
                role: "admin",
                status: "active",
                provider: "email",
                emailVerified: true
            });
            console.log("✅ Admin user created with 'admin12345@'");
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updatePassword();
