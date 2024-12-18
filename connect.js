const { MongoClient } = require("mongodb")
require('dotenv').config()

const uri = process.env.MONGODB_URI

const client = new MongoClient(uri)

async function connectToDatabase() {
    try {
        await client.connect()
        console.log("Connected to server")
        return client
    }
    catch (err) {
        console.error("Error connecting to server:", err)
    }
}

module.exports = { connectToDatabase }