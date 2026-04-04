const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
});

const User = mongoose.model('User', UserSchema);

async function checkAll() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({});
        let result = '--- ALL USERS ---\n';
        users.forEach(a => {
            result += `Name: ${a.name}, Email: ${a.email}, Role: ${a.role}\n`;
        });
        fs.writeFileSync('all_users_snapshot.txt', result);
        console.log('Result saved');
        process.exit();
    } catch (err) {
        fs.writeFileSync('all_users_snapshot.txt', 'Error: ' + err.message);
        process.exit(1);
    }
}

checkAll();
