const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const querystring = require('querystring');
require('dotenv').config();



const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));


// database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zfkd7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_DETAIL_COLLECTION}`);
  // perform actions on the collection object

  // for getting all volunteer data from database
  app.get('/volunteer', (req, res) => {
    collection.find({})
    .toArray( (err, documents) => {
        res.send(documents)
    })
  })

  // for getting specified volunteer from database
  app.get('/volunteer/:id', (req, res) => {
    collection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, documents) => {
        res.send(documents[0])
      })
    })
  
  // for sending new volunteer in database. #admin access only
  app.post('/addvolunteerdetail', (req, res) => {
    const data = req.body
      collection.insertOne(data)
      .then(result => {
        res.send(result)
      })
      .catch(err => console.log(err))
  });
});

  
// for setting the collection to user registered volunteer
client.connect(err => {
  const collection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_USER_VOLUNTEER_COLLECTION}`);
  // perform actions on the collection object

  // for getting all registered volunteer event for admin only
  app.get('/volunteer/admin', (req, res) => {
    collection.find({})
    .toArray( (err, documents) => {
      res.send(documents)
    } )
  })

  // for getting specified user registered volunteer detail
  app.get('/getuservolunteer/', (req, res) => {
    collection.find({email: req.query.email})
    .toArray( (err, documents) => {
      res.send(documents)
    } )
  })

  // for sending any registered volunteer in database #access by all user
  app.post('/registervolunteer', (req, res) => {
    const data = req.body
      collection.insertOne(data)
      .then(result => {
        res.send(result)
      })
      .catch(err => console.log(err))
  });

  // for deleting any registered volunteer from database #admin access only
  app.delete('/admin/volunteerdelete/:id', (req, res) => {
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
        res.send(result.deletedCount > 0)
    })
  })

  // for deleting any user registered volunteer from database. #only that user can delete
  app.delete('/volunteerdelete/:id', (req, res) => {
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
        res.send(result.deletedCount > 0)
    })
  })
})












app.listen(5000)