const { MongoClient } = require("mongodb");


// const url = "mongodb+srv://nikitabishnoi52_db_user:Password123@cluster0.2moamdw.mongodb.net/?appName=Cluster0";

//const url = "mongodb+srv://nikitabishnoi52_db_user:Password123@cluster0.2moamdw.mongodb.net/?appName=Cluster0";
const url="mongodb://nikitabishnoi52_db_user:Password123@ac-ehuj3qu-shard-00-00.2moamdw.mongodb.net:27017,ac-ehuj3qu-shard-00-01.2moamdw.mongodb.net:27017,ac-ehuj3qu-shard-00-02.2moamdw.mongodb.net:27017/?ssl=true&replicaSet=atlas-n0ejr7-shard-0&authSource=admin&appName=Cluster0"
const client = new MongoClient(url);

const dbName = "sample_mflix";
``
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
