const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// tasky-web
// pass: 41T4urk95N9Tx1rj




app.use(cors());
app.use(express.json());



// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@project-server.fv9q8on.mongodb.net/?retryWrites=true&w=majority&appName=Project-server`;




// const uri = "mongodb+srv://<db_username>:<db_password>@project-server.fv9q8on.mongodb.net/?retryWrites=true&w=majority&appName=Project-server";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const workCollection = client.db('workDB').collection('working')
        const UsersCollection = client.db('workDB').collection('users')
        // const Usersbits = client.db('workDB').collection('bits')

        app.get('/working', async (req, res) => {
            const result = await workCollection.find().toArray();
            res.send(result)
        })
        app.get('/working/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await workCollection.findOne(query)
            res.send(result)
        })

        app.post('/working', async (req, res) => {
            const newWork = req.body;
            console.log(newWork);
            const result = await workCollection.insertOne(newWork);
            res.send(result)
        })
        app.put('/working/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateWork = req.body;

            const updateDoc = {
                $set: updateWork
            };

            const result = await workCollection.updateOne(filter, updateDoc, options);

            res.send(result);
        });

        app.delete('/working/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await workCollection.deleteOne(query);
            res.send(result)
        })
        // user related APIs

        app.get('/users', async (req, res) => {
            const result = await UsersCollection.find().toArray();
            res.send(result)
        })

        app.get('/users', async (req, res) => {
            const result = await UsersCollection.find().toArray();
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const UserProfile = req.body;
            console.log(UserProfile);
            const result = await UsersCollection.insertOne(UserProfile);
            res.send(result)
        })

        // Bits Cloction

        // app.get('/bits', async (req, res) => {
        //     const taskId = req.params.taskId;
        //     const query = { taskId: taskId };
        //     const bids = await Usersbits.find(query).toArray();
        //     res.send(bids);
        // });



    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send(' Freelance Hub Server: Empowering Your Projects with Top Talent Inspired by Tasky!');
});

app.listen(port, () => {
    console.log(`Tasky server is running on port ${port}`);
});
