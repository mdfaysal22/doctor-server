const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port  = process.env.PORT || 5000;   //Port 

const app = express();  

// Middleware 
app.use(express.json());   //For Get and Post JSON Document.... 
app.use(cors()); //Using data by another domain or IP
dotenv.config(); //Create .env.local file and Using Security Purpose 


app.get('/', (req, res)=>{
    res.send("Hello, I am Doctor Portal Site Server");    //Default get method
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.k8emzbd.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try{
        const appointmentOptions = client.db('Doctor-portal').collection('appointment-Options');

        app.get('/appointmentOptions', async(req, res) => {
            const query = {}
            const cursor = appointmentOptions.find(query);
            const options = await cursor.toArray();
            res.send(options);
        })
    }
    finally{}
}

run().catch(err => console.log(err));


app.listen(port, () => {
    console.log(`Doctor Portal Site is Running By ${port}`)   //Server Listing Port 
})