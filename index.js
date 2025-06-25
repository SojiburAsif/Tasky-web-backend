const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin:['https://symphonious-bubblegum-ad2f44.netlify.app', 'http://localhost:5173']
}));
app.use(express.json()); 

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@project-server.fv9q8on.mongodb.net/?retryWrites=true&w=majority&appName=Project-server`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
// fdfs
async function run() {
    try {
        const workCollection = client.db('workDB').collection('working');
        const UsersCollection = client.db('workDB').collection('users');

        // --- Work APIs ---
        app.get('/working', async (req, res) => {
            const result = await workCollection.find().toArray();
            res.send(result);
        });

        app.get('/working/:id', async (req, res) => {
            const id = req.params.id;
            const result = await workCollection.findOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        app.post('/working', async (req, res) => {
            const newWork = req.body;
            const result = await workCollection.insertOne(newWork);
            res.send(result);
        });

        app.put('/working/:id', async (req, res) => {
            const id = req.params.id;
            const updateWork = req.body;
            const result = await workCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateWork },
                { upsert: true }
            );
            res.send(result);
        });

        app.delete('/working/:id', async (req, res) => {
            const id = req.params.id;
            const result = await workCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // --- Users API ---
        app.get('/users', async (req, res) => {
            const result = await UsersCollection.find().toArray();
            res.send(result);
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await UsersCollection.insertOne(user);
            res.send(result);
        });



    } finally {
        // await client.close(); // Only close if needed
    }
}
run().catch(console.dir);

// Home route
app.get('/', (req, res) => {
    res.send(' Freelance Hub Server: Empowering Your Projects with Top Talent Inspired by Tasky!');
});

// Server listen
app.listen(port, () => {
    console.log(`Tasky server is running on port ${port}`);
});
