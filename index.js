const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 3000;
const app = express();

const uri = `mongodb+srv://${process.env.DB_USERR}:${process.env.DB_PASSS}@cluster0.tnbzfze.mongodb.net/?appName=Cluster0`;
console.log(process.env.DB_USERR, process.env.DB_PASSS);

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    const homeNestDB = client.db("home-nest");
    const propertiesCollection = homeNestDB.collection("properties");

    app.get("/properties", async (req, res) => {
      const result = await propertiesCollection.find().toArray();
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Home Nest");
});

app.listen(port, () => {
  console.log("Home Nest is Starting server");
});
