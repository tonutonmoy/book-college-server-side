const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config();
const port = process.env.PORT || 5000;
console.log(process.env.MONGODB_USER_NAME, process.env.MONGODB_PASSWORD, process.env.DATABASE_NAME)

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//  mongoose start
const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_PASSWORD}@cluster0.andsvfa.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`)
  .then((e) => {
    console.log('Mongoose is ready');
  })
  .catch(error => {
    console.log('Mongoose error');
    console.log(error);
  });

// mongoose end




//  mongoose Schema start
const allCollegesSchema = new mongoose.Schema({
  img: { type: String, required: true },

  name: { type: String, required: true },

  admission: { type: String, required: true },

  event: { type: String, required: true },

  researchHistory: { type: String, required: true },

  sports: { type: String, required: true },

  admissionProcess: { type: String, required: true },

  rating: { type: String, required: true },

  researchNumber: { type: String, required: true },


});

const admissionDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  birth: { type: String, required: true },
  address: { type: String, required: true },
  subject: { type: String, required: true },
  number: { type: String, required: true },
  image: { type: String, required: true },
  collegeDetails: { type: Object, required: true },
  loginEmail: { type: String, required: true },


});
const allUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: String,
  university:String,

});
const reviewDataSchema = new mongoose.Schema({
  collegeInfo: { type: Object, required: true },
  rating: { type: String, required: true },
  review: { type: String, required: true },


});

//  mongoose Schema end



//  mongoose model start




const allColleges = mongoose.model("allColleges", allCollegesSchema);
const allUsers = mongoose.model("allUsers", allUserSchema);
const admissionData = mongoose.model("admissionData", admissionDataSchema);
const reviewData = mongoose.model("reviewData", reviewDataSchema);

//  mongoose model end







app.get('/', (req, res) => {

  res.send('hello')
})







// allColleges
app.get('/allCollages', async (req, res) => {
  try {
    const result = await allColleges.find();
    if (result) {
      res.send(result);
    } else {
      res.status(404).send('Data not found');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});



// search  single College
app.get('/singleCollage/:college', async (req, res) => {
try{
  const college = req?.params?.college;






  const result = await allColleges.find({

    $or: [

      { name: { $regex: college, $options: "i" } },

    ]

  })

  res.send(result)
} catch (error) {
  console.error('Error fetching review data:', error);

  res.status(500).json({ error: 'Internal Server Error' });
}
});



// get single allColleges
app.get('/allCollages/:id', async (req, res) => {
try{
  const id = req.params.id;



  const result = await allColleges.findOne({ _id: id })

  res.send(result)
} catch (error) {
  console.error('Error fetching review data:', error);

  res.status(500).json({ error: 'Internal Server Error' });
}
});



// allUsers store in data base 
app.post('/allUsers', async (req, res) => {
try{
  const user = req.body;

  

  const resultFind = await allUsers.findOne({ email: user.email })



  if (resultFind) {
    return res.send({ message: 'You are already login' })

  }


  const filterModel = new allUsers({
    name: req?.body?.name,
    email: req?.body?.email,
    address: req?.body?.address,
    university: req?.body?.university,
  })


  
  const result = await filterModel.save()

  res.send(result)
} catch (error) {
  console.error('Error fetching review data:', error);

  res.status(500).json({ error: 'Internal Server Error' });
}
});


//  get single user
app.get('/allUsers', async (req, res) => {

try{

  
  const result = await allUsers.findOne({ email: req?.query?.email })

  console.log(req?.query?.email )

  res.send(result)
} catch (error) {
  console.error('Error fetching review data:', error);

  res.status(500).json({ error: 'Internal Server Error' });
}
});





//  update single user
app.put('/updateUser', async (req, res) => {

try{

  const email = req?.query?.email;
  const info = req?.body;

  const query = { email: email }

  const updateDoc = {
    $set: {
      name: info?.name,
      university: info?.university,
      address: info?.address

    },
  };

  const options = { upsert: true };




  const result = await allUsers.updateOne(query, updateDoc, options)

 
  res.send(result)
} catch (error) {
  console.error('Error fetching review data:', error);

  res.status(500).json({ error: 'Internal Server Error' });
}
});



// submit admission data
app.post('/admissionData', async (req, res) => {

try{

  const filterData = new admissionData({
    name: req?.body?.name,
    email: req?.body?.email,
    birth: req?.body?.birth,
    address: req?.body?.address,
    subject: req?.body?.subject,
    number: req?.body?.number,
    image: req?.body?.image,
    collegeDetails: req?.body?.collegeDetails,
    loginEmail: req?.body?.loginEmail,
  })

  const result = await filterData.save()

  res.send(result)
} catch (error) {
  console.error('Error fetching review data:', error);

  res.status(500).json({ error: 'Internal Server Error' });
}
});



// get submit data from admissionData database for myCollege page 
app.get('/admissionData', async (req, res) => {
  try {
    const query = req?.query?.email


    const result = await admissionData.find({ loginEmail: query })

    res.send(result)
  } catch (error) {
    console.error('Error fetching review data:', error);

    res.status(500).json({ error: 'Internal Server Error' });
  }


});


// post review data
app.post('/reviewData', async (req, res) => {
  try {
   

    const filterData = new reviewData({
      collegeInfo: req?.body?.collegeInfo,
      rating: req?.body?.rating,
      review: req?.body?.review,
    })

    const result = await filterData.save()

    res.send(result)

  } catch (error) {
    console.error('Error fetching review data:', error);

    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// get review data 
app.get('/reviewData', async (req, res) => {
  try {
    const result = await reviewData.find();

    res.send(result)
  } catch (error) {
    console.error('Error fetching review data:', error);

    res.status(500).json({ error: 'Internal Server Error' });
  }
});









app.listen(port, () => {

  console.log(port, 'is running')
})