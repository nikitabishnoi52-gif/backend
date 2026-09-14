const { MongoClient } = require("mongodb");

const url = "mongodb+srv://nikitabishnoi52_db_user:Password123@cluster0.2moamdw.mongodb.net/?appName=Cluster0";

const client = new MongoClient(url);

const dbName = "sample_mflix";

async function connectDB() {
    try {
        await client.connect();

        console.log("MongoDB Connected Successfully!");

        const db = client.db(dbName);

        return db;
    } catch (error) {
        console.log("MongoDB Connection Error:", error);
    }
}

module.exports = connectDB;
