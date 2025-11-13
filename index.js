const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERR}:${process.env.DB_PASSS}@cluster0.tnbzfze.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    // await client.db("admin").command({ ping: 1 });

    const homeNestDB = client.db("home-nest");
    const propertiesCollection = homeNestDB.collection("properties");
    const usersCollection = homeNestDB.collection("user");

    app.get("/properties/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await propertiesCollection.findOne(query);
      res.send(result);
    });

    // app.get("/properties", async (req, res) => {
    //   const email = req.query.email;
    //   let query = {};
    //   if (email) {
    //     query = { "postedBy.email": email };
    //   }

    //   const cursor = propertiesCollection.find(query).sort({ price: 1 });
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });

    app.post("/properties", async (req, res) => {
      const newData = req.body;
      const result = await propertiesCollection.insertOne(newData);
      res.send(result);
    });

    app.delete("/properties/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await propertiesCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/properties", async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query = { "postedBy.email": email };
      }

      const cursor = propertiesCollection.find(query).sort({ price: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/comments", async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query = { "commentBy.email": email };
      }

      const cursor = propertiesCollection.find(query);
      const result = await cursor.toArray();

      res.send(result);
    });

    // Users apis
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const email = req.body.email;
      const query = { email: email };
      const existingUser = await usersCollection.findOne(query);

      if (existingUser) {
        res.send({
          message: "user already exits. do not need to insert again",
        });
      } else {
        const result = await usersCollection.insertOne(newUser);
        res.send(result);
      }
    });

    // Put
    app.put("/properties/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      const objectId = new ObjectId(id);

      const filter = { _id: objectId };
      const updateData = {
        $set: data,
      };

      const result = await propertiesCollection.updateOne(filter, updateData);
      console.log(result);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Home Nest");
});

app.listen(port, () => {
  console.log("Home Nest is Starting server");
});
