import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String },
    role: String,
});

const User = mongoose.model('User', UserSchema);

async function checkAdmins() {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        const admins = await User.find({ role: { $in: ['admin', 'officer'] } });
        let result = '--- ADMIN USERS ---\n';
        admins.forEach(a => {
            result += `Name: ${a.name}, Email: ${a.email}, Role: ${a.role}\n`;
        });
        require('fs').writeFileSync('admin_snapshot.txt', result);
        console.log('Admin list saved to admin_snapshot.txt');
        await mongoose.disconnect();
    } catch (err) {
        require('fs').writeFileSync('admin_snapshot.txt', 'Error connecting to DB: ' + err.message);
    }
}

checkAdmins();
