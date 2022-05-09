const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qgz7b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const inventoryCollection = client.db('wood-world').collection('inventory');
        const fullCollection = client.db('wood-world').collection('collection');
        const expertCollection = client.db('wood-world').collection('experts');

        
        // AUTH
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '10d'
            });
            res.send({ accessToken });
        })

        // Inventory Collection
        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = inventoryCollection.find(query);
            const inventory = await cursor.toArray();
            res.send(inventory);
        })

        app.get('/collection', async (req, res) => {
            const query = {};
            const cursor = fullCollection.find(query);
            const collection = await cursor.toArray();
            res.send(collection);
        })

        app.get('/experts', async (req, res) => {
            const query = {};
            const cursor = expertCollection.find(query);
            const expert = await cursor.toArray();
            res.send(expert);
        })

        // Service Details
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await inventoryCollection.findOne(query);
            res.send(item);
        });

        app.get('/collection/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await fullCollection.findOne(query);
            res.send(item);
        });

        //PUT
        // app.put('/inventory/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const item = await inventoryCollection.updateOne(query);
        //     res.send(item);
        // });

        // POST
        app.post('/collection', async (req, res) => {
            const newItem = req.body;
            const result = await fullCollection.insertOne(newItem);
            res.send(result);
        });

        // DELETE
        app.delete('/collection/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await fullCollection.deleteOne(query);
            res.send(result);
        });



    }
    finally {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Wood World Running!')
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})