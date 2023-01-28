const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// working
//user: dbuser1
//pass: L7YhwBcPJIWIFQhD

// not working
//user: dbuser2
//pass: hrjyJQqCohb3yRFO


const uri = "mongodb+srv://dbuser2:hrjyJQqCohb3yRFO@cluster0.mktejfv.mongodb.net/?retryWrites=true&w=majority";
// const uri = "mongodb+srv://dbuser1:L7YhwBcPJIWIFQhD@cluster0.mktejfv.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const userCollection = client.db('nodeMongoCrud').collection('users');
        // const userCollection = client.db('simpleNode').collection('users');

        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const user = await userCollection.find(query);
            res.send(user);
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = req.body;
            // console.log(user);

            const option = { upsert: true };
            const updatedUser = {
                $set: {
                    name: user.name,
                    address: user.address,
                    // email: user.email
                }
            }

            const result = await userCollection.update(query, updatedUser, option);
            res.send(result);

        });

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(`Deleted ${id}`);
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });

    }
    finally {
        //
    }
}

run().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('Hello From Node Mongo Server!');
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});


