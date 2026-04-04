const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
});

const User = mongoose.model('User', UserSchema);

async function checkAdmins() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admins = await User.find({ role: { $in: ['admin', 'officer'] } });
        let result = '--- ADMIN USERS ---\n';
        admins.forEach(a => {
            result += `Name: ${a.name}, Email: ${a.email}, Role: ${a.role}\n`;
        });
        fs.writeFileSync('admin_snapshot.txt', result);
        console.log('Result saved');
        process.exit();
    } catch (err) {
        fs.writeFileSync('admin_snapshot.txt', 'Error: ' + err.message);
        process.exit(1);
    }
}

checkAdmins();
