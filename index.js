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
        const bookingsCollections = client.db('Doctor-portal').collection('bookings');

        app.get('/appointmentOptions', async(req, res) => {
            const query = {}
            const date = req.query.date;
            const bookingQuery = {date : date};

            const cursor = appointmentOptions.find(query);
            const options = await cursor.toArray();
            const alreadyBooked = await bookingsCollections.find(bookingQuery).toArray();
            options.forEach(option => {
                const optionBooked = alreadyBooked.filter(booked => booked.nameOfAppointment === option.name)
                const bookedSlots = optionBooked.map(booked => booked.time)
                const remainingOptions = option.slots.filter(slot => !bookedSlots.includes(slot));
                option.slots = remainingOptions
            });
            res.send(options);
        })

        app.post('/bookings', async(req, res) => {
            const bookings = req.body;
            const bookingData = await bookingsCollections.insertOne(bookings);
            res.send(bookingData);
        })

        app.get('/bookings', async(req, res) => {
            const query = {};
            const cursor = bookingsCollections.find(query);
            const bookings = await cursor.toArray();
            res.send(bookings);
        })



    }
    finally{}
}

run().catch(err => console.log(err));


app.listen(port, () => {
    console.log(`Doctor Portal Site is Running By ${port}`)   //Server Listing Port 
})