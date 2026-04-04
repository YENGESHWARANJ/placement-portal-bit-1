import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://yengesh:yengesh@cluster0.hoxge.mongodb.net/placement-portal-db?retryWrites=true&w=majority';

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String, select: false },
    role: { type: String, enum: ['student', 'recruiter', 'admin', 'officer'], default: 'student' },
    status: { type: String, default: 'active' }
});

const User = mongoose.model('User', UserSchema);

async function createOfficer() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const email = 'officer@bitsathy.ac.in';
        const rawPassword = 'officer123@';
        
        const existing = await User.findOne({ email });
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        if (existing) {
            existing.password = hashedPassword;
            existing.role = 'officer'; // Ensure they are an officer
            await existing.save();
            console.log('Updated existing officer account.');
        } else {
            await User.create({
                name: 'BIT Placement Officer',
                email,
                password: hashedPassword,
                role: 'officer',
                status: 'active'
            });
            console.log('Created new placement officer account.');
        }

        await mongoose.disconnect();
        console.log('Done.');
    } catch (err) {
        console.error(err);
    }
}

createOfficer();
