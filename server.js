const express = require("express")
const cors = require('cors')
const { connectToDatabase } = require("./connect")
const bodyParser = require('body-parser')
const sanitize = require('mongo-sanitize')

const app = express()
const port = process.env.PORT || 3000
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

// emulating Live Server
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))
app.use('/', express.static(__dirname))

// store submission in database
app.post("/submit", async (req, res) => {
    let client
    const obj = { 
        name: sanitize(req.body.name),
        id: sanitize(req.body.id),
        creator: sanitize(req.body.creator),
        video: sanitize(req.body.video)
    }
    const { name, id, creator, video } = obj

    if (!name || !id || !creator || !video) {
        return res.status(400).json({ error: "Please fill in all fields!" })
    }

    // store in database
    try {
        client = await connectToDatabase()
        if (!client) {
            return res.status(500).json({ error: "Database connection failed" })
        }

        const db = client.db("creator-event-1")
        const submissions = db.collection("submissions")

        // create item and add to database
        const timestamp = Date.now()
        const obj = { timestamp, name, id, creator, video }
        await submissions.insertOne(obj)

        res.status(200).json({ message: "Submission successful!" })
    } catch (err) {
        console.error("Error uploading submission:", err)
        res.status(500).json({ error: "Error uploading submission." })
    }
    finally {
        client.close()
    }
})

// query the database from the spreadsheet
app.get('/api/query', async (req, res) => {
    try {
        client = await connectToDatabase()
        if (!client) {
            return res.status(500).json({ error: "Database connection failed" })
        }

        const db = client.db("creator-event-1")
        const submissions = db.collection("submissions")
        const documents = await submissions.find({}, {}, { limit: 100 }).toArray();
        res.json(documents);
    } catch (err) {
        console.error("Error fetching documents:", err);
        res.status(500).json({ error: "Failed to fetch documents" });
    }
});

// get port
app.get("/config", (req, res) => {
    res.json({ port });
});

app.listen(port, (err) => {
    if (err) {
        console.error("Error starting server:", err)
    }
    else {
        console.log(`Server running at http://localhost:${port}`)
    }
})
