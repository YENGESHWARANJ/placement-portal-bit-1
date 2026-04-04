import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://yengesh:wvZuZDaCpV78hDVz@cluster0.m6vmoms.mongodb.net/?appName=Cluster0';

// Minimal schemas for seeding
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: String, default: 'student' }
});
const User = mongoose.model('User', UserSchema);

const StudentSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    name: String,
    usn: { type: String, unique: true },
    branch: String,
    year: Number,
    status: String,
    company: String,
    profilePicture: String
});
const Student = mongoose.model('Student', StudentSchema);

async function seedPlaced() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const placedData = [
            { name: "Arun Kumar", email: "arun.kumar@bitsathy.ac.in", branch: "CSE", year: 2024, company: "Google", usn: "7376211CS101" },
            { name: "Priya Sharma", email: "priya.s@bitsathy.ac.in", branch: "IT", year: 2024, company: "Microsoft", usn: "7376211IT205" },
            { name: "Vijay Singh", email: "vijay.v@bitsathy.ac.in", branch: "ECE", year: 2024, company: "Amazon", usn: "7376211EC312" },
            { name: "Deepa Rani", email: "deepa.r@bitsathy.ac.in", branch: "AI&DS", year: 2024, company: "Atlassian", usn: "7376211AD401" }
        ];

        for (const data of placedData) {
            let user = await User.findOne({ email: data.email });
            if (!user) {
                user = await User.create({
                    name: data.name,
                    email: data.email,
                    role: 'student',
                    password: 'password123'
                });
            }

            const existingStudent = await Student.findOne({ usn: data.usn });
            if (!existingStudent) {
                await Student.create({
                    userId: user._id,
                    name: data.name,
                    usn: data.usn,
                    branch: data.branch,
                    year: data.year,
                    status: "Placed",
                    company: data.company,
                    profilePicture: `https://ui-avatars.com/api/?name=${data.name.replace(' ', '+')}&background=random`
                });
                console.log(`Seeded: ${data.name}`);
            } else {
                existingStudent.status = "Placed";
                existingStudent.company = data.company;
                await existingStudent.save();
                console.log(`Updated: ${data.name}`);
            }
        }

        await mongoose.disconnect();
        console.log('Finished seeding placed students.');
    } catch (err) {
        console.error(err);
    }
}

seedPlaced();
