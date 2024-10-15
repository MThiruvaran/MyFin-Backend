// * Importing the essential libraries for the application
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const  bodyParser = require('body-parser')

// * Initializing the express application
const app = express()
app.use(cors());
app.use(bodyParser.json())


// * MongoDB connection to local server
mongoose.connect('mongodb://localhost:27017/myfin_banking_app',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => console.log('MongoDB connection has been successfully established'))
.catch(error => console.log('error occured: ',error.message))

// Todo: all the routes should be listed below


// * Starting the express server
const port = process.env.PORT || 3002
app.listen(port, ()=>{
    console.log("Server is running on the port: ", port)
})