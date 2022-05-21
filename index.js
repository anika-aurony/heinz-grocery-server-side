const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

//middleware
app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tbinh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const itemCollection = client.db('warehouseInventory').collection('product');

        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);

        });

        //Load data base on id
        app.get('/inventory/:id' , async (req, res) =>{
            const id = req.params.id;
            
            const query = {_id: ObjectId(id)};
            const product = await itemCollection.findOne(query);
            res.send(product);
        });

        //POST
        app.post('/inventory', async (req, res) => {
            const newProduct = req.body;
            const result = await itemCollection.insertOne(newProduct);
            res.send(result);

        });

        //Delete
        app.delete('/inventory/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        });
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Running warehouse");
});

app.listen(port, () => {
    console.log('Listening to port', port)
})