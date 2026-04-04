import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model("User", userSchema);

const studentProfileSchema = new mongoose.Schema({}, { strict: false });
const StudentProfile = mongoose.models.Student || mongoose.model("Student", studentProfileSchema);

const driveSchema = new mongoose.Schema({}, { strict: false });
const PlacementDrive = mongoose.models.PlacementDrive || mongoose.model("PlacementDrive", driveSchema);

const jobSchema = new mongoose.Schema({}, { strict: false });
const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

const seedUsers = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/placement_portal";
        await mongoose.connect(uri);
        console.log("Connected to MongoDB cluster successfully.");
        
        console.log("Purging existing data...");
        await User.deleteMany({});
        await StudentProfile.deleteMany({});
        await PlacementDrive.deleteMany({});
        await Job.deleteMany({});

        const salt = await bcrypt.genSalt(12);

        // 1. Create Core Users
        const usersToCreate = [
            { name: "System Admin", email: "admin@bitsathy.ac.in", rawPassword: "admin12345@", role: "admin" },
            { name: "Student User", email: "student@bitsathy.ac.in", rawPassword: "student123@", role: "student" },
            { name: "Mentor User", email: "mentor@bitsathy.ac.in", rawPassword: "mentor123@", role: "recruiter" },
            { name: "Placement Officer", email: "placement@bitsathy.ac.in", rawPassword: "placement123@", role: "officer" }
        ];

        let adminId: string = "";

        for (const u of usersToCreate) {
            const hashedPassword = await bcrypt.hash(u.rawPassword, salt);
            const created = await User.create({
                name: u.name,
                email: u.email,
                password: hashedPassword,
                role: u.role,
                status: "active",
                provider: "email",
                emailVerified: true
            });

            if (u.role === "admin") adminId = created._id;

            if (u.role === "student") {
                await StudentProfile.create({
                    userId: created._id,
                    name: created.name,
                    usn: `BIT${created._id.toString().slice(-6).toUpperCase()}`,
                    branch: "Computer Science",
                    year: 4,
                    cgpa: 8.5,
                    status: "Unplaced",
                    aptitudeScore: 75,
                    codingScore: 80,
                    interviewScore: 70,
                    resumeScore: 85
                });
            }
        }

        // 2. Create Sample PLACED Students for Showcase
        const showcaseNames = ["Arun Kumar", "Priya Sharma", "Vijay Singh", "Deepa Rani"];
        const companies = ["Google", "Microsoft", "Amazon", "Zoho"];
        
        for (let i = 0; i < showcaseNames.length; i++) {
            const fakeUser = await User.create({
                name: showcaseNames[i],
                email: `placed${i}@bitsathy.ac.in`,
                password: "password123",
                role: "student"
            });

            await StudentProfile.create({
                userId: fakeUser._id,
                name: showcaseNames[i],
                usn: `BITPLACED00${i}`,
                branch: "IT",
                year: 2024,
                status: "Placed",
                company: companies[i],
                profilePicture: `https://i.pravatar.cc/150?u=${showcaseNames[i]}`
            });
        }

        // 3. Create Sample Placement Drives
        const driveData = [
            {
                company: "TCS Ninja",
                jobRole: "System Engineer",
                packageName: "4.5 LPA",
                salary: "4.5 LPA",
                date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                venue: "BIT Audi",
                deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                status: "Open",
                criterias: { cgpa: 6.0, branches: ["CSE", "IT", "ECE"], skills: ["Java", "SQL"], arrearsAllowed: true },
                createdBy: adminId
            },
            {
                company: "Accenture",
                jobRole: "Associate Software Engineer",
                packageName: "6.5 LPA",
                salary: "6.5 LPA",
                date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                venue: "Virtual",
                deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                status: "Open",
                criterias: { cgpa: 7.0, branches: ["CSE", "IT"], skills: ["Python", "JS"], arrearsAllowed: false },
                createdBy: adminId
            }
        ];
        await PlacementDrive.insertMany(driveData);

        // 4. Create Sample Jobs for Dashboard Recommendations
        const jobData = [
            {
                recruiterId: adminId,
                title: "Frontend Developer",
                company: "Tech Mahindra",
                location: "Chennai",
                type: "Full-time",
                salary: "8 LPA",
                description: "React and Tailwind experience required.",
                requirements: ["React", "JavaScript"],
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                active: true
            },
            {
                recruiterId: adminId,
                title: "Backend Specialist",
                company: "Freshworks",
                location: "Bangalore",
                type: "Full-time",
                salary: "12 LPA",
                description: "Node.js and MongoDB proficiency.",
                requirements: ["Node.js", "MongoDB"],
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                active: true
            }
        ];
        await Job.insertMany(jobData);

        console.log("✅ Full system seeded with sample data!");
        process.exit(0);
    } catch (err: any) {
        console.error("SEED ERROR:", err.message);
        if (err.stack) console.error(err.stack);
        process.exit(1);
    }
};

seedUsers();
