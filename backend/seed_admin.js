const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String },
    role: String,
});

const User = mongoose.model('User', UserSchema);

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Remove existing admin if it exists to reset
        await User.deleteOne({ email: 'admin@bitsathy.ac.in' });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin@123', salt);
        
        const admin = new User({
            name: 'BIT Placement Officer',
            email: 'admin@bitsathy.ac.in',
            password: hashedPassword,
            role: 'admin'
        });
        
        await admin.save();
        console.log('Default Admin Created: admin@bitsathy.ac.in / admin@123');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedAdmin();
