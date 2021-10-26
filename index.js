const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
// env file 
require('dotenv').config();

const app = express()
const port = process.env.PORT || 7000;

// middle ware set
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l5n9e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// uri check আসছে কি না
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log("connected to database");

        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');

        // GET API ALL data 
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET SINGLE SERVICE
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log("Getting secfic services", id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);

        })

        // POST API 
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log("services hitted post api", service);
            
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        // DELETE OPERATION API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log("hitting delete form server",id);
            const quary = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(quary)
            res.json(result);
            // res.send("Hited Delete")

        })
    }
    finally {
        // await client.close() 
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("From Backend Running Server")
})

app.listen(port, () => {
    console.log("Running liser here node", port);
})