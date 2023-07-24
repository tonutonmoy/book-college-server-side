const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config();
const port = process.env.PORT || 5000;


app.use(cors())

app.use(express.json())



app.get('/', (req, res) => {

  res.send('hello')
})



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_PASSWORD}@cluster0.andsvfa.mongodb.net/?retryWrites=true&w=majority`;

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


    const database = client.db("bookingCollege");
    const allColleges = database.collection("allColleges");
    const allUsers = database.collection("allUsers");
    const admissionData = database.collection("admissionData");
    const reviewData = database.collection("reviewData");



    // allColleges
    app.get('/allCollages', async (req, res) => {

      const result = await allColleges.find().toArray()

      res.send(result)
    });


    // search  single College
    app.get('/singleCollage/:college', async (req, res) => {

      const college= req.params.college;

      


     

      const result = await allColleges.find( {

        $or: [
 
         {name: { $regex: college, $options: "i"}},
        
        ]
 
       }).toArray()

      res.send(result)
    });



    // get single allColleges
    app.get('/allCollages/:id', async (req, res) => {

      const id= req.params.id;

     

      const result = await allColleges.findOne({_id: new ObjectId(id)})

      res.send(result)
    });



    // allUsers store in data base 
    app.post('/allUsers', async (req, res) => {

      const user = req.body;



      const resultFind = await allUsers.findOne({ email: user.email })

      if (resultFind) {
        return res.send({ message: 'You are already login' })

      }



      const result = await allUsers.insertOne(user)

      res.send(result)
    });


    //  get single user
    app.get('/allUsers', async (req, res) => {

         

      const result = await allUsers.findOne({email: req?.query?.email})

      res.send(result)
    });


    //  get single user data for navbar 
    app.get('/allUsers', async (req, res) => {

      const email=req?.query?.email;

      const result = await allUsers.findOne({email: email})

      res.send(result)
    });


    //  update single user
    app.put('/updateUser', async (req, res) => {

          

          const email=req.query.email;
          const info=req.body;

          const query={email: email}

          const updateDoc = {
            $set: {
              name: info?.name,
              university: info?.university,
              address: info?.address

            },
          };

          const options = { upsert: true };
  

          

      const result = await allUsers.updateOne(query,updateDoc,options)

      res.send(result)
    });



    // submit admission data
    app.post('/admissionData', async (req, res) => {

      const info = req.body;

      const result = await admissionData.insertOne(info)

      res.send(result)
    });



    // get submit data from admissionData database for myCollege page 
    app.get('/admissionData', async (req, res) => {

      const query = req?.query?.email

      
      const result = await admissionData.find({loginEmail: query}).toArray()

      res.send(result)

      
    });


    // post review data
    app.post('/reviewData', async (req, res) => {

      const info = req.body;

      const result = await reviewData.insertOne(info)

      res.send(result)
    });

    // get review data 
    app.get('/reviewData', async (req, res) => {



      const result = await reviewData.find().toArray()

      res.send(result)
    });



    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.listen(port, () => {

  console.log(port, 'is running')
})