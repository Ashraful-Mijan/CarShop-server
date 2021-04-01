const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
// const { ObjectId } = require('mongodb');

// const userpass = 'd9UxSRHdEwmC5kk'
// const userName = 'CarshopUser'

const app = express()
app.use(cors())
app.use(bodyParser.json())

const port = 9000

const uri = "mongodb+srv://CarshopUser:d9UxSRHdEwmC5kk@cluster0.vjryr.mongodb.net/carshopdb?retryWrites=true&w=majority";



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("carshopdb").collection("cars");
    const orderCollection = client.db("orders").collection("order");

    app.post('/addProduct', (req, res) => {
        const newEvent = req.body;
        collection.insertOne(newEvent)
            .then(result => {
                console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    //read data
    app.get('/product', (req, res) => {
        collection.find({})
            .toArray((err, items) => {
                // console.log(items)
                res.send(items)
            })
    })

    app.get(`/checkouts/:id`, (req, res) => {
        const id = req.params.id
        collection.find({_id: ObjectId(id)})
            .toArray((err, items) => {
                res.send(items)
            })
    })

    //delete product
    app.delete('/delete/:id', (req, res) => {
        console.log(req.params.id)
        collection.deleteOne({ _id: ObjectId(req.params.id) })
        .then(result => {
            console.log(result);
            res.send(result.deletedCount > 0)
        })
    })

    //
    app.post('/orders', (req, res) => {
        orderCollection.insertOne(req.body)
        .then(result => console.log(result))
    })

    app.get('/getOrder', (req, res) => {
        const email = req.query.email;
        console.log(email)
        orderCollection.find({email: email})
            .toArray((err, items) => {
                res.send(items)
            })
    })

    console.log('database connected')
});




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port)