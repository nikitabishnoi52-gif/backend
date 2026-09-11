const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";

const client = new MongoClient(url);

const dbName = "local";

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