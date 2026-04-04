import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function run() {
    await mongoose.connect(process.env.MONGO_URI!);
    const db = mongoose.connection.db!;
    const user = await db.collection("users").findOne({ email: "cz@gmail.com" });
    if (user) {
        console.log("Found user:", user.email, "| role:", user.role, "| status:", user.status, "| emailVerified:", user.emailVerified);
        // Fix the user to be admin, active, verified
        await db.collection("users").updateOne(
            { email: "cz@gmail.com" },
            { $set: { role: "admin", status: "active", emailVerified: true } }
        );
        console.log("✅ Updated cz@gmail.com to admin/active/verified");
    } else {
        console.log("No user found with cz@gmail.com");
    }
    await mongoose.disconnect();
}
run();
