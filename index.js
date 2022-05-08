const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qgz7b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect();
        const inventoryCollection = client.db('wood-world').collection('inventory');
        const orderCollection = client.db('wood-world').collection('order');


        // Inventory Collection
        app.get('/inventory', async (req, res) =>{
            const query = {};
            const cursor = inventoryCollection.find(query);
            const inventory = await cursor.toArray();
            res.send(inventory);
        })

        // Service Details
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await inventoryCollection.findOne(query);
            res.send(item);
        });

        //Order
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.findOne(order);
            res.send(result);
        })


    }
    finally{

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Wood World Running!')
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})