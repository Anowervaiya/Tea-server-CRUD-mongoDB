const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.user}:${process.env.password}@cluster0.zsn3kat.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db('Tea');
    const Tea = database.collection('Tea');

    app.get('/tea', async (req, res) => {
      const cursor = Tea.find();
      const result =await cursor.toArray();
      console.log(result);
      res.send(result);
    });


    app.post('/tea', async (req, res) => {
      const data = req.body;
      const result = await Tea.insertOne(data);

      console.log(result);
      res.send(result);
    });

    app.delete('/tea/:id', async (req, res) => {
      const Id = req.params.id;
      console.log(Id);
      const query = {
        _id: new ObjectId(Id)
      }
      const result = await Tea.deleteOne(query);
      res.send(result);

    })

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
