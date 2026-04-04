import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://yengesh:wvZuZDaCpV78hDVz@cluster0.m6vmoms.mongodb.net/?appName=Cluster0';

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        const count = await mongoose.connection.db?.collection('students').countDocuments({ status: 'Placed' });
        console.log(`Placed Students Count: ${count}`);
        
        const samples = await mongoose.connection.db?.collection('students').find({ status: 'Placed' }).limit(2).toArray();
        console.log('Samples:', JSON.stringify(samples, null, 2));
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
