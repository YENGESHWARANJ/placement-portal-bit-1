import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const checkDB = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/placement_portal";
        await mongoose.connect(uri);
        const collections = await mongoose.connection.db?.listCollections().toArray();
        console.log("Collections:", collections?.map(c => c.name));
        
        for (const coll of collections || []) {
            const doc = await mongoose.connection.db?.collection(coll.name).findOne();
            console.log(`First doc in ${coll.name}:`, JSON.stringify(doc, null, 2));
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDB();
