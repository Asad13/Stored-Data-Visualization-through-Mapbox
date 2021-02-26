const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

//load env vars
dotenv.config({ path : './config/config.env'});

//Connect to database
connectDB();

//Initializing express
const app = express();

//Body Parser
app.use(express.json());

//Enable Cors
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
//__dirname means current directory

//Sample Route for testing
/*app.get('/api/v1/incidents',(req,res) => {
    res.send("Hello");
});*/
// Routes
//Routes
app.use('/api/v1/incidents',require('./routes/incidents'));

//Initializing Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`));