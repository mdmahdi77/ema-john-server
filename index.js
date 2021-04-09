const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h25va.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = 5000

app.get('/', (req, res) => {
  res.send("hellow db it's from working")
})

app.use(bodyParser.json())
app.use(cors())


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("order");
  
  app.post('/addProduct', (req, res) => {
    const products = req.body
    console.log(products)
    productCollection.insertOne(products)
    .then(result => {
        console.log(result.insertedCount)
        res.send(result.insertedCount)
    })
  })

  app.get('/products', (req, res) => {
    const search = req.query.body
    productCollection.find({ name: { $regex: search } })
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.get('/product/:key', (req, res) => {
    productCollection.find({key: req.params.key})
    .toArray((err, documents) => {
      res.send(documents[0])
    })
  })

  app.post('/productsByKeys', (req, res) => {
    const productsKeys = req.body
    productCollection.find({key: { $in: productsKeys }})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body
    console.log(order)
    ordersCollection.insertOne(order)
    .then(result => {
        console.log(result.insertedCount)
        res.send(result.insertedCount > 0)
    })
  })


});


app.listen(process.env.PORT || port)